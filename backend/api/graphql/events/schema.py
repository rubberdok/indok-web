import graphene
from apps.events.models import Event

from .mutations import (
    CreateCategory,
    CreateEvent,
    DeleteCategory,
    DeleteEvent,
    UpdateCategory,
    UpdateEvent,
)
from .resolvers import EventResolvers
from .types import CategoryType, EventType


class EventMutations(graphene.ObjectType):
    create_event = CreateEvent.Field()
    update_event = UpdateEvent.Field()
    delete_event = DeleteEvent.Field()
    create_category = CreateCategory.Field()
    update_category = UpdateCategory.Field()
    delete_category = DeleteCategory.Field()


class EventQueries(graphene.ObjectType, EventResolvers):
    all_events = graphene.List(
        EventType,
        category=graphene.String(required=False),
        organization=graphene.String(required=False),
        start_time=graphene.DateTime(required=False),
        end_time=graphene.DateTime(required=False),
    )
    event = graphene.Field(EventType, id=graphene.ID(required=True))
    all_categories = graphene.List(CategoryType)
    category = graphene.Field(CategoryType, id=graphene.ID(required=True))
