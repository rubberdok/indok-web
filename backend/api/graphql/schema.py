import graphene

from .events.schema import EventMutations, EventQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
from .users.schema import UserMutations, UserQueries


class Query(
    EventQueries,
    UserQueries,
    OrganizationQueries,
):
    pass


class Mutations(
    EventMutations,
    UserMutations,
    OrganizationMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
