import graphene
import graphql_jwt
from django.conf import settings

from .mutations import AuthUser, GetIDToken, UpdateUser
from .resolvers import UserResolvers
from .types import UserType


class UserMutations(graphene.ObjectType):
    auth_user = AuthUser.Field()
    update_user = UpdateUser.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    get_id_token = GetIDToken.Field()


class UserQueries(graphene.ObjectType, UserResolvers):
    all_users = graphene.List(UserType)
    user = graphene.Field(UserType)

    if settings.ENVIRONMENT == "test":
        auth_token = graphene.String()
