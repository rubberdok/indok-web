import graphene
from api.auth.dataporten_auth import DataportenAuth
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token

from .types import UserType


class AuthUser(graphene.Mutation):
    class Arguments:
        code = graphene.String()

    token = graphene.String(required=True)
    user = graphene.Field(UserType)

    def mutate(self, info, code):
        user = DataportenAuth.authenticate_and_get_user(code=code)
        token = get_token(user)
        info.context.set_jwt_cookie = token
        return AuthUser(user=user, token=token)


class UpdateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        first_name = graphene.String()
        last_name = graphene.String()
        year = graphene.String()
        feide_userid = graphene.ID()

    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    def mutate(
        self,
        info,
        id,
        email=None,
        username=None,
        first_name=None,
        last_name=None,
        year=None,
        feide_userid=None,
    ):
        user = get_user_model().objects.get(pk=id)
        user.save(
            email=email if email is not None else user.email,
            username=username if username is not None else user.username,
            first_name=first_name if first_name is not None else user.first_name,
            last_name=last_name if last_name is not None else user.last_name,
            year=year if year is not None else user.year,
            feide_userid=feide_userid
            if feide_userid is not None
            else user.feide_userid,
        )

        ok = True
        return UpdateUser(user=user, ok=ok)


class GetIDToken(graphene.Mutation):
    id_token = graphene.String(required=True)

    @login_required
    def mutate(self, info):
        user = info.context.user
        id_token = user.id_token

        return GetIDToken(
            id_token=id_token,
        )
