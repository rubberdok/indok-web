import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries

class Queries(
    EventQueries,
    ListingQueries,
    OrganizationQueries,
):
    pass


class Mutations(
    EventMutations,
    ListingMutations,
    OrganizationMutations,
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
