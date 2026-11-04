import graphene

from .resolvers import NfcResolvers
from .types import DoorLogPage, NfcDoorAccessOverviewType, NfcManualAccessType


class NfcQueries(graphene.ObjectType, NfcResolvers):
    nfc_door_access = graphene.Field(
        NfcDoorAccessOverviewType,
        past_days=graphene.Int(),
    )
    nfc_manual_accesses = graphene.List(
        graphene.NonNull(NfcManualAccessType),
    )
    door_log = graphene.Field(
        DoorLogPage,
        offset=graphene.Int(),
        limit=graphene.Int(),
        result=graphene.String(description="ACCESS_GRANTED, ACCESS_DENIED, DOOR_OPENED, EXIT_BUTTON or FORCED_OPEN"),
        search=graphene.String(description="Name, card number or door"),
        since=graphene.DateTime(),
        until=graphene.DateTime(),
        description="Door events from ARX, newest first. Needs nfc.view_door_log.",
    )
