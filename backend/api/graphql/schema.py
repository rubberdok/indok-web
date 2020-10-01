import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries
from .listing_response.schema import ListingResponseQueries, ListingResponseMutations
from .organizations.schema import OrganizationMutations, OrganizationQueries

class Queries(
    EventQueries,
    ListingQueries,
    ListingResponseQueries,
    OrganizationQueries,
):
    pass


class Mutations(
    EventMutations,
    ListingMutations,
    ListingResponseMutations,
    OrganizationMutations,
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
