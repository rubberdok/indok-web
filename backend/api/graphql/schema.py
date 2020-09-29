import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries
from .listing_response.schema import ListingResponseQueries, ListingResponseMutations

class Queries(
    EventQueries,
    ListingQueries,
    ListingResponseQueries,
):
    pass


class Mutations(
    EventMutations,
    ListingMutations,
    ListingResponseMutations
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
