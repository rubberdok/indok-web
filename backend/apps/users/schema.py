import graphene
from graphene import NonNull
from django.conf import settings

from .mutations import AuthUser, Logout, UpdateUser
from .resolvers import UserResolvers
from .types import UserType


class UserMutations(graphene.ObjectType):
    auth_user = AuthUser.Field(required=True)
    update_user = UpdateUser.Field()
    logout = Logout.Field()


class UserQueries(graphene.ObjectType, UserResolvers):
    all_users = graphene.List(NonNull(UserType))
    user = graphene.Field(UserType)
    logout = graphene.String(required=True)

    if settings.ENVIRONMENT == "test":
        test_auth = graphene.Field(UserType)
