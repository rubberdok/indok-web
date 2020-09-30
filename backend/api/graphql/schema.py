import graphene

from .events.schema import EventMutations, EventQueries
from .cabins.schema import BookingMutations, BookingQueries


class Query(EventQueries, BookingQueries):
    pass


class Mutations(EventMutations, BookingMutations):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
