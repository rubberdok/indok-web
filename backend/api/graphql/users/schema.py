import graphene
import graphql_jwt

from .mutations import AuthUser, UpdateUser
from .resolvers import UserResolvers
from .types import UserType


class UserMutations(graphene.ObjectType):
    auth_user = AuthUser.Field()
    update_user = UpdateUser.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()


class UserQueries(graphene.ObjectType, UserResolvers):
    all_users = graphene.List(UserType)
    user = graphene.Field(UserType)
