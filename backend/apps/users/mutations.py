import re
from typing import TYPE_CHECKING, Optional, cast

import graphene
from api.auth.dataporten_auth import DataportenAuth
from decorators import login_required
from django.contrib.auth import get_user_model, login, logout
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.utils import timezone
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
    nfc_mifare_csn = graphene.String()
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
    mifare_csn = graphene.String(required=False)
    pin_code = graphene.String(required=False)
    permanent_access = graphene.Boolean(required=False)
    permanent_access_until = graphene.DateTime(
        required=False, description="Når permanent tilgang slutter."
    )
    note = graphene.String(required=False, description="Begrunnelse for permanent tilgang.")


def _get_self_registered_card_label(user: "models.User") -> str:
    full_name = user.get_full_name().strip()
    if not full_name:
        full_name = user.username
    return f"{full_name} sitt kort (E)"


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

        if new_nfc_pin_code != "" and not re.match(r"^\d{4}$", new_nfc_pin_code, flags=re.ASCII):
            raise ValueError("PIN-kode må være nøyaktig 4 sifre")

        active_assignment.pin_code = new_nfc_pin_code
        active_assignment.full_clean()
        active_assignment.save(update_fields=["pin_code_encrypted"])

    for k, v in user_data.items():
        if k not in ("graduation_year", "nfc_pin_code", "nfc_mifare_csn"):
            setattr(target_user, k, v)
        elif k == "graduation_year":
            update_graduation_year(target_user, new_graduation_year)


def _apply_user_nfc_mifare_csn_update(
    acting_user: "models.User", target_user: "models.User", mifare_csn_input: str
) -> None:
    from apps.nfc.models import (
        NfcCard,
        NfcCardAssignment,
        display_card_number,
        is_user_mifare_csn_self_service_enabled,
        normalize_card_identifier,
        validate_card_identifier,
    )

    if not is_user_mifare_csn_self_service_enabled():
        raise ValueError("Egenregistrering av kortnummer er deaktivert")

    normalized_mifare_csn = normalize_card_identifier(mifare_csn_input)
    if normalized_mifare_csn == "":
        raise ValueError("Kortnummer kan ikke være tomt")

    validate_card_identifier(normalized_mifare_csn)
    entered_card_number = display_card_number(mifare_csn_input)

    active_assignment = (
        NfcCardAssignment.objects.select_related("card").filter(user=target_user, revoked_at__isnull=True).first()
    )

    if active_assignment is not None:
        if active_assignment.card.mifare_csn == normalized_mifare_csn:
            # Same card typed again, perhaps as the number printed on it: remember that form.
            if not active_assignment.card.card_number:
                active_assignment.card.card_number = entered_card_number
                active_assignment.card.save(update_fields=["card_number"])
            return
        raise ValueError("Du kan bare registrere kortnummer én gang. Kontakt admin for endringer.")

    has_any_previous_assignment = NfcCardAssignment.objects.filter(user=target_user).exists()
    if has_any_previous_assignment:
        raise ValueError("Du kan bare registrere kortnummer én gang. Kontakt admin for endringer.")

    card, created = NfcCard.objects.get_or_create(mifare_csn=normalized_mifare_csn)
    if created:
        card.label = _get_self_registered_card_label(target_user)
        card.save(update_fields=["label"])

    card_active_assignment = NfcCardAssignment.objects.filter(card=card, revoked_at__isnull=True).first()
    if card_active_assignment and card_active_assignment.user and card_active_assignment.user.pk != target_user.pk:
        raise ValueError("Kortnummer er allerede i bruk av en annen bruker")

    if not card.card_number:
        card.card_number = entered_card_number
        card.save(update_fields=["card_number"])

    assignment = NfcCardAssignment(
        card=card,
        user=target_user,
        assigned_by=acting_user,
    )
    assignment.save()


class UpdateUser(graphene.Mutation):
    class Arguments:
        user_data = UserInput(required=False)

    user = graphene.Field(UserType)

    @login_required
    def mutate(self, info: ResolveInfo, user_data: Optional[dict] = None) -> Optional["UpdateUser"]:
        if user_data is None:
            return None

        user: "models.User" = info.context.user

        user_data = dict(user_data)
        nfc_mifare_csn = user_data.pop("nfc_mifare_csn", None)

        try:
            with transaction.atomic():
                if nfc_mifare_csn is not None:
                    _apply_user_nfc_mifare_csn_update(user, user, nfc_mifare_csn)

                _apply_user_updates(user, user_data)

                if not user.email and not user_data.get("email"):
                    user.email = user.feide_email

                if user.first_login:
                    user.first_login = False

                user.full_clean(exclude=["password"])
                user.save()
        except (ValidationError, IntegrityError, ValueError) as e:
            raise GraphQLError(str(e))

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

        target_user = cast(
            Optional["models.User"],
            get_user_model().objects.filter(pk=user_id).first(),
        )
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

    @staticmethod
    def _active_assignment(user, *, select_card=False):
        from apps.nfc.models import NfcCardAssignment

        assignments = NfcCardAssignment.objects
        if select_card:
            assignments = assignments.select_related("card")
        return assignments.filter(user=user, revoked_at__isnull=True).first()

    @staticmethod
    def _update_card_assignment(target_user, acting_user, mifare_csn, assignment):
        from apps.nfc.models import (
            NfcCard,
            NfcCardAssignment,
            NfcPermanentAccessChange,
            display_card_number,
            normalize_card_identifier,
            validate_card_identifier,
        )

        normalized_csn = normalize_card_identifier(mifare_csn)
        if normalized_csn == "":
            raise GraphQLError("Kortnummer kan ikke være tomt")
        validate_card_identifier(normalized_csn)

        card, _ = NfcCard.objects.get_or_create(mifare_csn=normalized_csn)
        entered_card_number = display_card_number(mifare_csn)
        if entered_card_number != card.mifare_csn:
            card.card_number = entered_card_number
            card.save(update_fields=["card_number"])

        card_assignment = NfcCardAssignment.objects.filter(card=card, revoked_at__isnull=True).first()
        if card_assignment and card_assignment.user and card_assignment.user.pk != target_user.pk:
            if card_assignment.permanent_access:
                NfcPermanentAccessChange.objects.create(
                    user=card_assignment.user,
                    changed_by=acting_user,
                    given=False,
                    reason="Kortet ble flyttet til en annen bruker",
                )
            card_assignment.revoke(revoked_by=acting_user, reason="Auto-revoked due to reassignment")

        if assignment and assignment.card and assignment.card.pk != card.pk:
            assignment.revoke(revoked_by=acting_user, reason="Auto-revoked due to new card number assignment")
            assignment = None

        if assignment is None:
            assignment = NfcCardAssignment(card=card, user=target_user, assigned_by=acting_user)
            assignment.save()
        return assignment

    @classmethod
    def _update_pin_code(cls, target_user, assignment, pin_code):
        if assignment is None:
            assignment = cls._active_assignment(target_user)
        if assignment is None:
            raise GraphQLError("Kan ikke oppdatere PIN-kode uten aktivt NFC-kort")
        if pin_code != "" and not re.match(r"^\d{4}$", pin_code, flags=re.ASCII):
            raise GraphQLError("PIN-kode må være nøyaktig 4 sifre")
        assignment.pin_code = pin_code
        assignment.full_clean()
        assignment.save(update_fields=["pin_code_encrypted"])
        return assignment

    @classmethod
    def _update_permanent_access(cls, target_user, assignment, permanent_access):
        if assignment is None:
            assignment = cls._active_assignment(target_user)
        if assignment is None:
            raise GraphQLError("Kan ikke oppdatere permanent tilgang uten aktivt NFC-kort")
        assignment.permanent_access = permanent_access
        if not permanent_access:
            assignment.permanent_access_until = None
        assignment.full_clean()
        assignment.save(update_fields=["permanent_access", "permanent_access_until"])
        return assignment

    @classmethod
    def _update_permanent_access_until(cls, target_user, assignment, until, previous_until):
        if assignment is None:
            assignment = cls._active_assignment(target_user)
        if assignment is None or not assignment.permanent_access:
            if until is None:
                return assignment
            raise GraphQLError("Sluttdato kan bare settes for personer med permanent tilgang")
        if until and until != previous_until and until <= timezone.now():
            raise GraphQLError("Sluttdatoen må være frem i tid")
        assignment.permanent_access_until = until
        assignment.save(update_fields=["permanent_access_until"])
        return assignment

    @staticmethod
    def _record_permanent_access_change(target_user, acting_user, had_access, assignment, previous_until):
        """It opens the door at all hours, so keep a history of who gave or removed it, and for how long."""
        from apps.nfc.models import NfcPermanentAccessChange, NfcUserNote

        has_access = bool(assignment and assignment.permanent_access)
        until = assignment.permanent_access_until if assignment else None
        reason = f"Til {timezone.localtime(until):%d.%m.%Y %H:%M}" if until and has_access else ""
        if has_access != had_access:
            NfcPermanentAccessChange.objects.create(
                user=target_user, changed_by=acting_user, given=has_access, reason=reason
            )
        elif has_access and until != previous_until:
            NfcPermanentAccessChange.objects.create(
                user=target_user, changed_by=acting_user, given=True, reason=reason or "Sluttdato fjernet"
            )
        if had_access and not has_access:
            NfcUserNote.objects.filter(user=target_user).delete()

    @staticmethod
    def _update_note(target_user, acting_user, note):
        from apps.nfc.models import NfcCardAssignment, NfcUserNote

        note = note.strip()
        if not note:
            NfcUserNote.objects.filter(user=target_user).delete()
            return
        if len(note) > NfcUserNote.MAX_LENGTH:
            raise GraphQLError(f"Notatet kan ikke være lengre enn {NfcUserNote.MAX_LENGTH} tegn")
        if not NfcCardAssignment.objects.filter(
            user=target_user, revoked_at__isnull=True, permanent_access=True
        ).exists():
            raise GraphQLError("Notat kan bare skrives for personer med permanent tilgang")
        if not NfcUserNote.objects.filter(user=target_user, note=note).exists():
            NfcUserNote.objects.update_or_create(user=target_user, defaults={"note": note, "updated_by": acting_user})

    @login_required
    def mutate(self, info: ResolveInfo, user_id: str, nfc_data: dict) -> "AdminUpdateUserNfc":
        acting_user: "models.User" = info.context.user

        if not can_manage_user_nfc(acting_user):
            raise GraphQLError("Du har ikke tilgang til å redigere NFC-data for brukere")

        target_user = cast(
            Optional["models.User"],
            get_user_model().objects.filter(pk=user_id).first(),
        )
        if target_user is None:
            raise GraphQLError("Fant ikke bruker")

        mifare_csn = nfc_data.get("mifare_csn")
        pin_code = nfc_data.get("pin_code")
        permanent_access = nfc_data.get("permanent_access")
        note = nfc_data.get("note")

        sets_until = "permanent_access_until" in nfc_data
        if not sets_until and mifare_csn is None and pin_code is None and permanent_access is None and note is None:
            raise GraphQLError("Du må sette kortnummer, PIN-kode, permanent tilgang, sluttdato eller notat.")

        try:
            with transaction.atomic():
                assignment = AdminUpdateUserNfc._active_assignment(target_user, select_card=True)
                had_access = bool(assignment and assignment.permanent_access)
                previous_until = assignment.permanent_access_until if assignment else None

                if mifare_csn is not None:
                    assignment = AdminUpdateUserNfc._update_card_assignment(
                        target_user, acting_user, mifare_csn, assignment
                    )

                if pin_code is not None:
                    assignment = AdminUpdateUserNfc._update_pin_code(target_user, assignment, pin_code)

                if permanent_access is not None:
                    assignment = AdminUpdateUserNfc._update_permanent_access(target_user, assignment, permanent_access)

                until = nfc_data["permanent_access_until"] if sets_until else previous_until
                if sets_until or (mifare_csn is not None and previous_until):
                    assignment = AdminUpdateUserNfc._update_permanent_access_until(
                        target_user, assignment, until, previous_until
                    )

                AdminUpdateUserNfc._record_permanent_access_change(
                    target_user, acting_user, had_access, assignment, previous_until
                )

                if note is not None:
                    AdminUpdateUserNfc._update_note(target_user, acting_user, note)

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
