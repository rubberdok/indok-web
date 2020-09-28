import graphene

from api.graphql.events.schema import EventMutations, EventQueries
from api.graphql.cabins.schema import BookingQueries


class Query(EventQueries, BookingQueries):
    pass


class Mutations(
    EventMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
