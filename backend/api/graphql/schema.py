import graphene

from .events.schema import EventMutations, EventQueries
from .archive.schema import ArchiveMutations, ArchiveQueries


class Query(
    EventQueries,
    ArchiveQueries
):
    pass


class Mutations(
    EventMutations,
    ArchiveMutations
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
