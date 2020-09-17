import graphene

from graphene import Argument
from graphene_django import DjangoObjectType
from datetime import datetime
from django.shortcuts import get_object_or_404

from .models import Event as EventModel


class EventType(DjangoObjectType):
    class Meta:
        model = EventModel


class CreateEvent(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        description = graphene.String()
        starttime = graphene.DateTime()

    ok = graphene.Boolean()
    event = graphene.Field(EventType)

    def mutate(root, info, title, description, starttime=None):
        event = EventModel.objects.create(
            title=title,
            description=description,
            starttime=starttime if starttime is not None else datetime.now(),
        )
        ok = True
        return CreateEvent(event=event, ok=ok)


class UpdateEvent(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        id = graphene.ID()
        description = graphene.String()
        starttime = graphene.types.datetime.DateTime()

    ok = graphene.Boolean()
    event = graphene.Field(EventType)

    def mutate(root, info, id, title=None, description=None):
        event = EventModel.objects.get(pk=id)
        event.title = title if title is not None else event.title
        event.description = (
            description if description is not None else event.description
        )

        ok = True
        return UpdateEvent(event=event, ok=ok)


class DeleteEvent(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    event = graphene.Field(EventType)

    def mutate(root, info, id):
        event = get_object_or_404(EventModel, pk=id)
        event.delete()
        ok = True
        return DeleteEvent(event=event, ok=ok)


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


class Event(graphene.ObjectType):
    title = graphene.String()
    description = graphene.String()


class Mutations(graphene.ObjectType):
    create_event = CreateEvent.Field()
    update_event = UpdateEvent.Field()
    delete_event = DeleteEvent.Field()
