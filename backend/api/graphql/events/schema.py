import graphene

from .mutations import CreateCategory, DeleteCategory, UpdateCategory
from .mutations import CreateEvent, DeleteEvent, UpdateEvent
from .resolvers import (
    resolve_all_categories,
    resolve_all_events,
    resolve_category,
    resolve_event,
)
from .types import CategoryType, EventType


class EventMutations(graphene.ObjectType):
    create_event = CreateEvent.Field()
    update_event = UpdateEvent.Field()
    delete_event = DeleteEvent.Field()


class EventQueries(graphene.ObjectType):
    all_events = graphene.List(EventType)
    event = graphene.Field(EventType, id=graphene.ID(required=True))

    def resolve_all_events(self, info):
        return resolve_all_events(info)

    def resolve_event(self, info, id):
        return resolve_event(info, id)


class CategoryMutations(graphene.ObjectType):
    create_category = CreateCategory.Field()
    update_category = UpdateCategory.Field()
    delete_category = DeleteCategory.Field()


class CategoryQueries(graphene.ObjectType):
    all_categories = graphene.List(CategoryType)
    category = graphene.Field(CategoryType, id=graphene.ID(required=True))

    def resolve_all_categories(self, info):
        return resolve_all_categories(info)

    def resolve_category(self, info, id):
        return resolve_category(info, id)
