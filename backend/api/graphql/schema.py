import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries
from .listing_response.schema import ListingReponseQueries

class Queries(
    EventQueries,
    ListingQueries,
    ListingReponseQueries,
):
    pass


class Mutations(
    EventMutations,
    ListingMutations
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
