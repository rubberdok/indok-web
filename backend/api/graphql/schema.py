import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries


class Queries(
    EventQueries,
    ListingQueries
):
    pass


class Mutations(
    EventMutations,
    ListingMutations
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
