import graphene

from graphene_django import DjangoObjectType

from events.models import Event

class EventType(DjangoObjectType):
    class Meta:
        model = Event
        fields = ("id", "title", "description", "starttime")


class EventQuery(graphene.ObjectType):
    all_events = graphene.List(EventType)
    event = graphene.Field(EventType, id=graphene.ID(required=True))

    def resolve_all_events(root, info):
        # We can easily optimize query count in the resolve method
        return Event.objects.all()

    def resolve_event(root, info, id):
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None
