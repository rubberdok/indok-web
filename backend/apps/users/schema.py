import graphene
from graphene import NonNull
from django.conf import settings

from .mutations import AdminUpdateUser, AdminUpdateUserNfc, AuthUser, Logout, UpdateUser
from .resolvers import UserResolvers
from .types import UserType


class UserMutations(graphene.ObjectType):
    auth_user = AuthUser.Field(required=True)
    update_user = UpdateUser.Field()
    admin_update_user = AdminUpdateUser.Field()
    admin_update_user_nfc = AdminUpdateUserNfc.Field()
    logout = Logout.Field()


class UserQueries(graphene.ObjectType, UserResolvers):
    all_users = graphene.List(NonNull(UserType))
    user_search = graphene.List(NonNull(UserType), query=graphene.String(required=True), limit=graphene.Int())
    nfc_user_search = graphene.List(NonNull(UserType), query=graphene.String(required=True), limit=graphene.Int())
    can_manage_user_profiles = graphene.Boolean(required=True)
    can_manage_user_nfc = graphene.Boolean(required=True)
    user = graphene.Field(UserType)
    logout = graphene.String(required=True)

    if settings.ENVIRONMENT == "test":
        test_auth = graphene.Field(UserType)
