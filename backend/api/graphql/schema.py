import graphene

from .cabins.schema import BookingMutations, BookingQueries
from .events.schema import EventMutations, EventQueries
from .users.schema import UserMutations, UserQueries


class Query(
    EventQueries,
    UserQueries,
    BookingQueries,
):
    pass


class Mutations(
    EventMutations,
    UserMutations,
    BookingMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
