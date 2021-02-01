import graphene

from .cabins.schema import CabinMutations, CabinQueries
from .archive.schema import ArchiveMutations, ArchiveQueries
from .events.schema import EventMutations, EventQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
from .users.schema import UserMutations, UserQueries


class Query(
    EventQueries,
    ArchiveQueries,
    UserQueries,
    CabinQueries,
    OrganizationQueries,
):
    pass


class Mutations(
    EventMutations,
    ArchiveMutations,
    UserMutations,
    CabinMutations,
    OrganizationMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
