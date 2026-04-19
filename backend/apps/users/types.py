import graphene
from graphene import NonNull
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from decorators import login_required, get_resolver_parent, permission_required_or_none
from apps.users.permissions import can_manage_user_nfc


class UserType(DjangoObjectType):
    grade_year = graphene.Int(source="grade_year")
    events = graphene.List(NonNull("apps.events.types.EventType"), source="events")
    allergies = graphene.String(required=False)
    can_update_year = graphene.Boolean()
    nfc_uid_hex = graphene.String()
    nfc_pin_code = graphene.String()
    nfc_permanent_access = graphene.Boolean()

    class Meta:
        model = get_user_model()

        fields = [
            "id",
            "last_login",
            "username",
            "first_name",
            "last_name",
            "email",
            "date_joined",
            "feide_userid",
            "feide_email",
            "id_token",
            "phone_number",
            "first_login",
            "graduation_year",
            "memberships",
            "events",
            "organizations",
            "responses",
            "year_updated_at",
        ]

    @staticmethod
    @login_required
    @permission_required_or_none("users.view_sensitive_info", fn=get_resolver_parent)
    def resolve_allergies(parent, info):
        return parent.allergies

    @staticmethod
    def resolve_can_update_year(parent, info):
        return parent.can_update_year

    @staticmethod
    @login_required
    def resolve_nfc_uid_hex(parent, info):
        if info.context.user.pk != parent.pk and not can_manage_user_nfc(info.context.user):
            return None

        from apps.nfc.models import NfcCardAssignment

        active_assignment = (
            NfcCardAssignment.objects.select_related("card")
            .filter(user=parent, revoked_at__isnull=True)
            .first()
        )
        return active_assignment.card.uid_hex if active_assignment else None

    @staticmethod
    @login_required
    def resolve_nfc_pin_code(parent, info):
        if info.context.user.pk != parent.pk and not can_manage_user_nfc(info.context.user):
            return None

        from apps.nfc.models import NfcCardAssignment

        active_assignment = NfcCardAssignment.objects.filter(user=parent, revoked_at__isnull=True).first()
        return active_assignment.pin_code if active_assignment else None

    @staticmethod
    @login_required
    def resolve_nfc_permanent_access(parent, info):
        if info.context.user.pk != parent.pk and not can_manage_user_nfc(info.context.user):
            return None

        from apps.nfc.models import NfcCardAssignment

        active_assignment = NfcCardAssignment.objects.filter(user=parent, revoked_at__isnull=True).first()
        return active_assignment.permanent_access if active_assignment else False
