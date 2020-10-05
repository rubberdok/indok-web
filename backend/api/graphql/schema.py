import graphene

from .events.schema import EventMutations, EventQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries


class Query(
    EventQueries,
    OrganizationQueries
):
    pass


class Mutations(
    EventMutations,
    OrganizationMutations
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
