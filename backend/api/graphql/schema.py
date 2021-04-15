import graphene

from .cabins.schema import CabinMutations, CabinQueries
from .archive.schema import ArchiveMutations, ArchiveQueries
from .events.schema import EventMutations, EventQueries
from .listings.schema import ListingMutations, ListingQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
from .users.schema import UserMutations, UserQueries
from .forms.schema import FormMutations, FormQueries
from .utils.schema import UtilQueries


class Queries(
    EventQueries,
    ArchiveQueries,
    UserQueries,
    CabinQueries,
    OrganizationQueries,
    ListingQueries,
    FormQueries,
    UtilQueries
):
    pass


class Mutations(
    EventMutations,
    ArchiveMutations,
    UserMutations,
    CabinMutations,
    OrganizationMutations,
    ListingMutations,
    FormMutations
):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
