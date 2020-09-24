import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries


class Query(
    EventQueries,
):
    pass


class Mutations(
    EventMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
