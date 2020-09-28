import graphene
from apps.events.models import Event

from .types import EventType


def resolve_all_events(info):
    return Event.objects.all()


def resolve_event(info, id):
    try:
        return Event.objects.get(id=id)
    except Event.DoesNotExist:
        return None
