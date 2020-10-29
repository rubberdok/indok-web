import graphene

from .types import UserType
from .resolvers import UserResolvers
from .mutations import CreateUser


class UserQueries(graphene.ObjectType, UserResolvers):
    user = graphene.Field(UserType, id=graphene.ID())
    users = graphene.List(UserType)


class UserMutations(graphene.ObjectType):
    create_user = CreateUser.Field()