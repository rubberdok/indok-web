import graphene

from .mutations import CreateCategory, DeleteCategory, UpdateCategory
from .mutations import CreateEvent, DeleteEvent, UpdateEvent
<<<<<<< HEAD
from .resolvers import (
    resolve_all_categories,
    resolve_all_events,
    resolve_category,
    resolve_event,
)
from .types import CategoryType, EventType
from .resolvers import EventResolvers
=======
from .types import CategoryType, EventType
from .resolvers import EventResolvers, CategoryResolvers
>>>>>>> 94a756da0bddd3b620e0c64e685e4595b646076d
from .types import EventType


class EventMutations(graphene.ObjectType):
    create_event = CreateEvent.Field()
    update_event = UpdateEvent.Field()
    delete_event = DeleteEvent.Field()


class EventQueries(graphene.ObjectType, EventResolvers):
    all_events = graphene.List(EventType)
    event = graphene.Field(EventType, id=graphene.ID(required=True))
<<<<<<< HEAD

    def resolve_all_events(self, info):
        return resolve_all_events(info)

    def resolve_event(self, info, id):
        return resolve_event(info, id)
=======
>>>>>>> 94a756da0bddd3b620e0c64e685e4595b646076d


class CategoryMutations(graphene.ObjectType):
    create_category = CreateCategory.Field()
    update_category = UpdateCategory.Field()
    delete_category = DeleteCategory.Field()


class CategoryQueries(graphene.ObjectType, CategoryResolvers):
    all_categories = graphene.List(CategoryType)
    category = graphene.Field(CategoryType, id=graphene.ID(required=True))
<<<<<<< HEAD

    def resolve_all_categories(self, info):
        return resolve_all_categories(info)

    def resolve_category(self, info, id):
        return resolve_category(info, id)
=======
>>>>>>> 94a756da0bddd3b620e0c64e685e4595b646076d
