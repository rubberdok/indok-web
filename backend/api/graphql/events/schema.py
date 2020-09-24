import graphene

from .mutations import CreateEvent, DeleteEvent, UpdateEvent
from .resolvers import resolve_all_events, resolve_event
from .types import EventType


class EventMutations(graphene.ObjectType):
    create_event = CreateEvent.Field()
    update_event = UpdateEvent.Field()
    delete_event = DeleteEvent.Field()


class EventQueries(graphene.ObjectType):
    all_events = graphene.List(EventType)
    event = graphene.Field(EventType, id=graphene.ID(required=True))

    def resolve_all_events(self, info):
        return resolve_all_events(info)

    def resolve_event(self, info, id):
        return resolve_event(info, id)
