import graphene

from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
<<<<<<< HEAD
from .surveys.schema import SurveyQueries, SurveyMutations
=======
from .users.schema import UserQueries, UserMutations
>>>>>>> feature/listings

class Queries(
    EventQueries,
    ListingQueries,
    OrganizationQueries,
<<<<<<< HEAD
    SurveyQueries,
=======
    UserQueries,
>>>>>>> feature/listings
):
    pass


class Mutations(
    EventMutations,
    ListingMutations,
    OrganizationMutations,
<<<<<<< HEAD
    SurveyMutations,
=======
    UserMutations,
>>>>>>> feature/listings
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
