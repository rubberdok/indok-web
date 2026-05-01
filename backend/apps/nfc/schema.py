import graphene
from graphene import NonNull

from .mutations import (
    AssignNfcCard,
    CreateNfcAccessGrant,
    LogNfcAccessEvent,
    RevokeNfcAccessGrant,
    RevokeNfcAssignment,
    UpsertNfcCard,
)
from .resolvers import NfcResolvers
from .types import NfcAccessEventType, NfcAccessGrantType, NfcCardAssignmentType, NfcCardType


class NfcMutations(graphene.ObjectType):
    upsert_nfc_card = UpsertNfcCard.Field()
    assign_nfc_card = AssignNfcCard.Field()
    revoke_nfc_assignment = RevokeNfcAssignment.Field()

    create_nfc_access_grant = CreateNfcAccessGrant.Field()
    revoke_nfc_access_grant = RevokeNfcAccessGrant.Field()

    log_nfc_access_event = LogNfcAccessEvent.Field()


class NfcQueries(graphene.ObjectType, NfcResolvers):
    nfc_cards = graphene.List(NonNull(NfcCardType))
    nfc_card = graphene.Field(NfcCardType, uid_hex=graphene.String(required=True))

    nfc_card_assignments = graphene.List(NonNull(NfcCardAssignmentType), active_only=graphene.Boolean(required=False))
    my_nfc_card_assignment = graphene.Field(NfcCardAssignmentType)

    nfc_access_grants = graphene.List(NonNull(NfcAccessGrantType), active_only=graphene.Boolean(required=False))

    nfc_access_events = graphene.List(
        NonNull(NfcAccessEventType),
        limit=graphene.Int(required=False),
        door_identifier=graphene.String(required=False),
    )
