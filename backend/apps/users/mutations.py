import re
from typing import TYPE_CHECKING, Optional

import graphene
from api.auth.dataporten_auth import DataportenAuth
from decorators import login_required
from django.contrib.auth import get_user_model, login, logout
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from graphene import ResolveInfo
from graphql import GraphQLError

from apps.users.helpers import update_graduation_year
from apps.users.permissions import can_manage_user_nfc, can_manage_user_profiles

from .types import UserType

if TYPE_CHECKING:
    from apps.users import models


class AuthUser(graphene.Mutation):
    class Arguments:
        code = graphene.String(required=True)

    user = graphene.Field(UserType, required=True)

    def mutate(self, info, code: str):
        user = DataportenAuth.authenticate_and_get_user(code=code)
        login(info.context, user, backend="django.contrib.auth.backends.ModelBackend")
        return AuthUser(user=user)


class UserInput(graphene.InputObjectType):
    email = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    graduation_year = graphene.Int()
    phone_number = graphene.String()
    allergies = graphene.String()
    nfc_pin_code = graphene.String()


class AdminUserInput(graphene.InputObjectType):
    username = graphene.String()
    email = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    graduation_year = graphene.Int()
    phone_number = graphene.String()
    allergies = graphene.String()


class AdminUserNfcInput(graphene.InputObjectType):
    uid_hex = graphene.String(required=False)
    pin_code = graphene.String(required=False)


def _apply_user_updates(target_user: "models.User", user_data: dict, allow_nfc_pin_code_update: bool = True) -> None:
    from apps.nfc.models import NfcCardAssignment

    new_graduation_year = user_data.get("graduation_year")
    new_nfc_pin_code = user_data.get("nfc_pin_code")

    if new_nfc_pin_code is not None:
        if not allow_nfc_pin_code_update:
            raise ValueError("PIN-kode kan ikke oppdateres i dette kallet")

        active_assignment = NfcCardAssignment.objects.filter(user=target_user, revoked_at__isnull=True).first()
        if active_assignment is None:
            raise ValueError("Kan ikke oppdatere PIN-kode uten aktivt NFC-kort")

        if new_nfc_pin_code != "" and not re.match(r"^\d{4}$", new_nfc_pin_code):
            raise ValueError("PIN-kode må være nøyaktig 4 sifre")

        active_assignment.pin_code = new_nfc_pin_code
        active_assignment.full_clean()
        active_assignment.save(update_fields=["pin_code"])

    for k, v in user_data.items():
        if k not in ("graduation_year", "nfc_pin_code"):
            setattr(target_user, k, v)
        elif k == "graduation_year":
            update_graduation_year(target_user, new_graduation_year)


class UpdateUser(graphene.Mutation):
    class Arguments:
        user_data = UserInput(required=False)

    user = graphene.Field(UserType)

    @login_required
    def mutate(self, info: ResolveInfo, user_data: Optional[dict] = None) -> Optional["UpdateUser"]:
        if user_data is None:
            return None

        user: "models.User" = info.context.user
        _apply_user_updates(user, user_data)

        if not user.email and not user_data.get("email"):
            user.email = user.feide_email

        if user.first_login:
            user.first_login = False

        user.full_clean(exclude=["password"])
        user.save()

        return UpdateUser(user=user)


class AdminUpdateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        user_id = graphene.ID(required=True)
        user_data = AdminUserInput(required=True)

    @login_required
    def mutate(self, info: ResolveInfo, user_id: str, user_data: dict) -> "AdminUpdateUser":
        acting_user: "models.User" = info.context.user

        if not can_manage_user_profiles(acting_user):
            raise GraphQLError("Du har ikke tilgang til å redigere andre brukere")

        target_user = get_user_model().objects.filter(pk=user_id).first()
        if target_user is None:
            raise GraphQLError("Fant ikke bruker")

        _apply_user_updates(target_user, user_data, allow_nfc_pin_code_update=False)

        if not target_user.email and not user_data.get("email"):
            target_user.email = target_user.feide_email

        target_user.full_clean(exclude=["password"])
        target_user.save()

        return AdminUpdateUser(user=target_user)


class AdminUpdateUserNfc(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        user_id = graphene.ID(required=True)
        nfc_data = AdminUserNfcInput(required=True)

    @login_required
    def mutate(self, info: ResolveInfo, user_id: str, nfc_data: dict) -> "AdminUpdateUserNfc":
        acting_user: "models.User" = info.context.user

        if not can_manage_user_nfc(acting_user):
            raise GraphQLError("Du har ikke tilgang til å redigere NFC-data for brukere")

        target_user = get_user_model().objects.filter(pk=user_id).first()
        if target_user is None:
            raise GraphQLError("Fant ikke bruker")

        from apps.nfc.models import NfcCard, NfcCardAssignment, normalize_uid_hex

        uid_hex = nfc_data.get("uid_hex")
        pin_code = nfc_data.get("pin_code")

        if uid_hex is None and pin_code is None:
            raise GraphQLError("Du må sende inn UID og/eller PIN-kode")

        try:
            with transaction.atomic():
                active_assignment = (
                    NfcCardAssignment.objects.select_related("card")
                    .filter(user=target_user, revoked_at__isnull=True)
                    .first()
                )
                assignment = active_assignment

                if uid_hex is not None:
                    normalized_uid = normalize_uid_hex(uid_hex)
                    if normalized_uid == "":
                        raise GraphQLError("UID kan ikke være tom")

                    card, _ = NfcCard.objects.get_or_create(uid_hex=normalized_uid)

                    card_active_assignment = NfcCardAssignment.objects.filter(card=card, revoked_at__isnull=True).first()
                    if card_active_assignment and card_active_assignment.user_id != target_user.id:
                        card_active_assignment.revoke(
                            revoked_by=acting_user,
                            reason="Auto-revoked due to reassignment",
                        )

                    if active_assignment and active_assignment.card_id != card.id:
                        active_assignment.revoke(
                            revoked_by=acting_user,
                            reason="Auto-revoked due to new UID assignment",
                        )
                        assignment = None

                    if assignment is None:
                        assignment = NfcCardAssignment(
                            card=card,
                            user=target_user,
                            assigned_by=acting_user,
                        )
                        assignment.save()

                if pin_code is not None:
                    if assignment is None:
                        assignment = NfcCardAssignment.objects.filter(user=target_user, revoked_at__isnull=True).first()

                    if assignment is None:
                        raise GraphQLError("Kan ikke oppdatere PIN-kode uten aktivt NFC-kort")

                    if pin_code != "" and not re.match(r"^\d{4}$", pin_code):
                        raise GraphQLError("PIN-kode må være nøyaktig 4 sifre")

                    assignment.pin_code = pin_code
                    assignment.full_clean()
                    assignment.save(update_fields=["pin_code"])
        except (ValidationError, IntegrityError) as e:
            raise GraphQLError(str(e))

        return AdminUpdateUserNfc(user=target_user)


class Logout(graphene.Mutation):
    id_token = graphene.String()

    @login_required
    def mutate(self, info: ResolveInfo):
        user: "models.User" = info.context.user
        logout(info.context)
        return Logout(id_token=user.id_token)
