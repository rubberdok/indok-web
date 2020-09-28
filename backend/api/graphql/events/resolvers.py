import graphene
from apps.events.models import Event

from .types import EventType


class EventResolvers:
    def resolve_all_events(self, info):
        return Event.objects.all()

    def resolve_event(self, info, id):
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None
