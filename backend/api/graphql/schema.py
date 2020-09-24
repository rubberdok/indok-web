import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries


class Query(
    EventQueries,
    ListingQueries
):
    pass


class Mutations(
    EventMutations,
    ListingMutations
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
