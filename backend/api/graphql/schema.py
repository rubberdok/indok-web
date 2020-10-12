import graphene

from .events.schema import EventMutations, EventQueries
from .events.schema import CategoryMutations, CategoryQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries


class Query(EventQueries, CategoryQueries, OrganizationQueries):
    pass


class Mutations(EventMutations, CategoryMutations, OrganizationMutations):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
