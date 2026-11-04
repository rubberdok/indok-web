import graphene
from decorators import login_required
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from graphql import GraphQLError

from apps.organizations.models import Organization
from apps.users.permissions import can_manage_user_nfc

from .models import NfcManualAccess
from .types import NfcManualAccessType

NO_PERMISSION = "Du har ikke tilgang til å gi adgang til JanHus"


class NfcManualAccessInput(graphene.InputObjectType):
    user_id = graphene.ID(required=False)
    organization_id = graphene.ID(required=False)
    organization_people = graphene.String(required=False, description="LEADERS or MEMBERS")
    starts_at = graphene.DateTime(required=True)
    ends_at = graphene.DateTime(required=True)
    reason = graphene.String(required=False)


class CreateNfcManualAccess(graphene.Mutation):
    class Arguments:
        access_data = NfcManualAccessInput(required=True)

    manual_access = graphene.Field(NfcManualAccessType)

    @login_required
    def mutate(self, info, access_data):
        if not can_manage_user_nfc(info.context.user):
            raise GraphQLError(NO_PERMISSION)

        user_id, organization_id = access_data.get("user_id"), access_data.get("organization_id")
        access = NfcManualAccess(
            starts_at=access_data["starts_at"],
            ends_at=access_data["ends_at"],
            reason=(access_data.get("reason") or "").strip(),
            created_by=info.context.user,
        )
        if user_id:
            access.user = get_user_model().objects.filter(pk=user_id).first()
            if access.user is None:
                raise GraphQLError("Fant ikke bruker")
        if organization_id:
            access.organization = Organization.objects.filter(pk=organization_id).first()
            if access.organization is None:
                raise GraphQLError("Fant ikke foreningen")
            access.organization_people = access_data.get("organization_people") or access.organization_people

        if access.ends_at <= timezone.now():
            raise GraphQLError("Sluttidspunktet må være frem i tid")
        try:
            access.full_clean()
        except ValidationError as error:
            raise GraphQLError(" ".join(error.messages))
        access.save()
        return CreateNfcManualAccess(manual_access=access)


class RemoveNfcManualAccess(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    @login_required
    def mutate(self, info, id):
        if not can_manage_user_nfc(info.context.user):
            raise GraphQLError(NO_PERMISSION)

        access = NfcManualAccess.objects.filter(pk=id, removed_at__isnull=True).first()
        if access is None:
            raise GraphQLError("Fant ikke adgangen")
        access.removed_at = timezone.now()
        access.removed_by = info.context.user
        access.save(update_fields=["removed_at", "removed_by"])
        return RemoveNfcManualAccess(ok=True)


class NfcMutations(graphene.ObjectType):
    create_nfc_manual_access = CreateNfcManualAccess.Field()
    remove_nfc_manual_access = RemoveNfcManualAccess.Field()
