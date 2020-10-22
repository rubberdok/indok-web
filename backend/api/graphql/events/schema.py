import graphene

from .mutations import CreateCategory, DeleteCategory, UpdateCategory
from .mutations import CreateEvent, DeleteEvent, UpdateEvent
from .types import CategoryType, EventType
from .resolvers import EventResolvers, CategoryResolvers


class EventMutations(graphene.ObjectType):
    create_event = CreateEvent.Field()
    update_event = UpdateEvent.Field()
    delete_event = DeleteEvent.Field()


class EventQueries(graphene.ObjectType, EventResolvers):
    all_events = graphene.List(
        EventType,
        category=graphene.String(required=False),
        organization=graphene.String(required=False),
        start_time=graphene.DateTime(required=False),
        end_time=graphene.DateTime(required=False),
    )
    event = graphene.Field(EventType, id=graphene.ID(required=True))


class CategoryMutations(graphene.ObjectType):
    create_category = CreateCategory.Field()
    update_category = UpdateCategory.Field()
    delete_category = DeleteCategory.Field()


class CategoryQueries(graphene.ObjectType, CategoryResolvers):
    all_categories = graphene.List(CategoryType)
    category = graphene.Field(CategoryType, id=graphene.ID(required=True))
