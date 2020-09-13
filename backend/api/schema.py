import graphene

from graphene_django import DjangoObjectType

from events.models import Event

class EventType(DjangoObjectType):
    class Meta:
        model = Event
        fields = ("id", "title", "description", "starttime")

class Query(graphene.ObjectType):
    all_events = graphene.List(EventType)

    def resolve_all_events(root, info):
        # We can easily optimize query count in the resolve method
        return Event.objects.all()

schema = graphene.Schema(query=Query)