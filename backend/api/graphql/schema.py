import graphene
import graphql_jwt

from .events.schema import EventMutations, EventQueries
from .users.schema import UserMutations, UserQueries


class JWTMutations(graphene.ObjectType):
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


class Query(
    EventQueries,
    UserQueries,
):
    pass


class Mutations(
    EventMutations,
    UserMutations,
    JWTMutations,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutations)
