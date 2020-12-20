import graphene

from .events.schema import EventMutations, EventQueries
from .users.schema import UserMutations, UserQueries


class Query(
    EventQueries,
    UserQueries,
):
    pass


class Mutations(
    EventMutations,
    UserMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
