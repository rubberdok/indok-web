import graphene

from .cabins.schema import BookingMutations, BookingQueries
from .events.schema import EventMutations, EventQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
from .users.schema import UserMutations, UserQueries


class Query(
    EventQueries,
    UserQueries,
    BookingQueries,
    OrganizationQueries,
):
    pass


class Mutations(
    EventMutations,
    UserMutations,
    BookingMutations,
    OrganizationMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
