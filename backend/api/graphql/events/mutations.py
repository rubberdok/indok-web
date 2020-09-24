from datetime import datetime

import graphene
from apps.events.models import Event as EventModel
from django.shortcuts import get_object_or_404
from graphene_django import DjangoObjectType

from .types import EventType


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
