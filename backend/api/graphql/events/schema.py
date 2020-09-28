import graphene

from .mutations import CreateEvent, DeleteEvent, UpdateEvent
from .resolvers import EventResolvers
from .types import EventType


class EventMutations(graphene.ObjectType):
    create_event = CreateEvent.Field()
    update_event = UpdateEvent.Field()
    delete_event = DeleteEvent.Field()


class EventQueries(graphene.ObjectType, EventResolvers):
    all_events = graphene.List(EventType)
    event = graphene.Field(EventType, id=graphene.ID(required=True))