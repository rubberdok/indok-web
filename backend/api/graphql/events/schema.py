import graphene
from apps.events.models import Event

from .mutations import CreateEvent, DeleteEvent, UpdateEvent
from .types import EventType


class EventMutations(graphene.ObjectType):
    create_event = CreateEvent.Field()
    update_event = UpdateEvent.Field()
    delete_event = DeleteEvent.Field()


class EventQueries(graphene.ObjectType):
    all_events = graphene.List(EventType)
    event = graphene.Field(EventType, id=graphene.ID(required=True))

    def resolve_all_events(root, info):
        return Event.objects.all()

    def resolve_event(info, id):
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None
