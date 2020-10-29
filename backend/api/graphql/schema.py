import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
from .surveys.schema import SurveyQueries, SurveyMutations
from .users.schema import UserQueries, UserMutations

class Queries(
    EventQueries,
    ListingQueries,
    OrganizationQueries,
    SurveyQueries,
    UserQueries,
):
    pass


class Mutations(
    EventMutations,
    ListingMutations,
    OrganizationMutations,
    SurveyMutations,
    UserMutations,
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
