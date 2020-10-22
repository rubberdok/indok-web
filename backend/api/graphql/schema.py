import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
from .users.schema import UserQueries, UserMutations

class Queries(
    EventQueries,
    ListingQueries,
    OrganizationQueries,
    UserQueries,
):
    pass


class Mutations(
    EventMutations,
    ListingMutations,
    OrganizationMutations,
    UserMutations,
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
