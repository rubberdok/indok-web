import graphene
from apps.events.models import Event
from graphene_django import DjangoObjectType


class EventType(DjangoObjectType):
    class Meta:
        model = Event