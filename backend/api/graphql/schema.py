import graphene

from .events.schema import EventMutations, EventQueries
from .users.schema import UserMutations, UserQueries
from .auth.schema import AuthMutations


class Query(
    EventQueries,
    UserQueries,
):
    pass


class Mutations(
    EventMutations,
    UserMutations,
    AuthMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
