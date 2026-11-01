import graphene

from .resolvers import NfcResolvers
from .types import DoorLogPage


class NfcQueries(graphene.ObjectType, NfcResolvers):
    door_log = graphene.Field(
        DoorLogPage,
        offset=graphene.Int(),
        limit=graphene.Int(),
        result=graphene.String(description="ACCESS_GRANTED, ACCESS_DENIED or DOOR_OPENED"),
        search=graphene.String(description="Name, card number or door"),
        since=graphene.DateTime(),
        until=graphene.DateTime(),
        description="Door events from ARX, newest first. Needs nfc.view_door_log.",
    )
