import graphene

from .cabins.schema import CabinMutations, CabinQueries
from .archive.schema import ArchiveMutations, ArchiveQueries
from .events.schema import EventMutations, EventQueries
from .listing.schema import ListingMutations, ListingQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
from .users.schema import UserMutations, UserQueries
from .surveys.schema import SurveyMutations, SurveyQueries


class Queries(
    EventQueries,
    ArchiveQueries,
    UserQueries,
    CabinQueries,
    OrganizationQueries,
    ListingQueries,
    SurveyQueries
    
):
    pass


class Mutations(
    EventMutations,
    ArchiveMutations,
    UserMutations,
    CabinMutations,
    OrganizationMutations,
    ListingMutations,
    SurveyMutations
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
