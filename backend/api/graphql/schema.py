import graphene

from .events.schema import EventMutations, EventQueries


class Query(
    EventQueries,
):
    pass


class Mutations(
    EventMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
