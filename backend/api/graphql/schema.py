import graphene

from .archive.schema import ArchiveMutations, ArchiveQueries
from .events.schema import EventMutations, EventQueries
from .organizations.schema import OrganizationMutations, OrganizationQueries
from .users.schema import UserMutations, UserQueries


class Query(
    EventQueries,
    ArchiveQueries,
    UserQueries,
    OrganizationQueries,
):
    pass


class Mutations(
    EventMutations,
    ArchiveMutations,
    UserMutations,
    OrganizationMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
