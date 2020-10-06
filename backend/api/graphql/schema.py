import graphene

from .events.schema import EventMutations, EventQueries
from .auth.schema import AuthMutations


class Query(
    EventQueries,
):
    pass


class Mutations(
    EventMutations,
    AuthMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
