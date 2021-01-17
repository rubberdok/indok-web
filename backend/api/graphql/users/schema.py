import graphene
import graphql_jwt

from .mutations import AuthUser, CreateUser, UpdateUser
from .resolvers import UserResolvers
from .types import UserType


class UserMutations(graphene.ObjectType):
    auth_user = AuthUser.Field()
    update_user = UpdateUser.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    create_user = CreateUser.Field()  # Old


class UserQueries(graphene.ObjectType, UserResolvers):
    all_users = graphene.List(UserType)
    users = graphene.List(UserType)  # Old
    user = graphene.Field(UserType)
    old_user = graphene.Field(UserType, id=graphene.ID())  # Old
