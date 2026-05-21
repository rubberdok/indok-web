import graphene
from graphene_django import DjangoObjectType

from .models import NfcAccessEvent, NfcAccessGrant, NfcCard, NfcCardAssignment


class NfcCardType(DjangoObjectType):
    active_assignment = graphene.Field("apps.nfc.types.NfcCardAssignmentType")

    class Meta:
        model = NfcCard
        fields = [
            "id",
            "uid_hex",
            "label",
            "notes",
            "is_enabled",
            "created_at",
            "updated_at",
        ]

    @staticmethod
    def resolve_active_assignment(card: NfcCard, info):
        return card.assignments.filter(revoked_at__isnull=True).first()


class NfcCardAssignmentType(DjangoObjectType):
    has_access_now = graphene.Boolean()

    class Meta:
        model = NfcCardAssignment
        fields = [
            "id",
            "card",
            "user",
            "external_holder_name",
            "assigned_by",
            "assigned_at",
            "access_start",
            "access_end",
            "permanent_access",
            "revoked_at",
            "revoked_by",
            "revocation_reason",
            "metadata",
        ]

    @staticmethod
    def resolve_has_access_now(assignment: NfcCardAssignment, info) -> bool:
        return assignment.has_access_at()


class NfcAccessGrantType(DjangoObjectType):
    has_access_now = graphene.Boolean()

    class Meta:
        model = NfcAccessGrant
        fields = [
            "id",
            "scope",
            "participant_policy",
            "booking",
            "granted_to_user",
            "granted_to_card",
            "granted_by",
            "access_start",
            "access_end",
            "permanent_access",
            "revoked_at",
            "revoked_by",
            "notes",
            "created_at",
            "updated_at",
        ]

    @staticmethod
    def resolve_has_access_now(grant: NfcAccessGrant, info) -> bool:
        return grant.has_access_at()


class NfcAccessEventType(DjangoObjectType):
    class Meta:
        model = NfcAccessEvent
        fields = [
            "id",
            "event_type",
            "source",
            "door_identifier",
            "uid_hex_reported",
            "card",
            "card_assignment",
            "resolved_user",
            "occurred_at",
            "notes",
            "raw_payload",
        ]
