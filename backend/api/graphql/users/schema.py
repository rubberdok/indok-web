import graphene

from .mutations import AuthUser, UpdateUser
from .resolvers import UserResolvers
from .types import UserType


class UserMutations(graphene.ObjectType):
    auth_user = AuthUser.Field()
    update_user = UpdateUser.Field()


class UserQueries(graphene.ObjectType, UserResolvers):
    all_users = graphene.List(UserType)
    user = graphene.Field(UserType)
