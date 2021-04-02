import graphene
from apps.ecommerce.schema import EcommerceMutations, EcommerceQueries

from .archive.schema import ArchiveMutations, ArchiveQueries
from .cabins.schema import CabinMutations, CabinQueries
from .events.schema import EventMutations, EventQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
from .users.schema import UserMutations, UserQueries
from .utils.schema import UtilQueries


class Query(
    EventQueries,
    ArchiveQueries,
    UserQueries,
    CabinQueries,
    OrganizationQueries,
    UtilQueries,
    EcommerceQueries,
):
    pass


class Mutations(
    EventMutations,
    ArchiveMutations,
    UserMutations,
    CabinMutations,
    OrganizationMutations,
    EcommerceMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
