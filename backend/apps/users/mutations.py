import graphene
from api.auth.dataporten_auth import DataportenAuth
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token
from guardian.shortcuts import get_anonymous_user

from apps.users.helpers import update_graduation_year

from .types import UserType


class AuthUser(graphene.Mutation):
    class Arguments:
        code = graphene.String()

    token = graphene.String()
    user = graphene.Field(UserType)
    is_indok_student = graphene.Boolean()
    id_token = graphene.String()

    def mutate(self, info, code):
        user, id_token = DataportenAuth.authenticate_and_get_user(code=code)

        token = get_token(user)
        info.context.set_jwt_cookie = token
        info.context.user = user or get_anonymous_user()
        return AuthUser(
            user=user,
            token=token,
            id_token=id_token,
        )


class UserInput(graphene.InputObjectType):
    email = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    graduation_year = graphene.Int()
    phone_number = graphene.String()
    allergies = graphene.String()


class UpdateUser(graphene.Mutation):
    class Arguments:
        user_data = UserInput(required=False)

    user = graphene.Field(UserType)

    @login_required
    def mutate(
        self,
        info,
        user_data=None,
    ):
        if user_data is None:
            return None

        user = info.context.user

        new_graduation_year = user_data.get("graduation_year")

        for k, v in user_data.items():
            if k != "graduation_year":
                setattr(user, k, v)
            elif k == "graduation_year":
                update_graduation_year(user, new_graduation_year)

        if not user.email and not user_data.get("email"):
            user.email = user.feide_email

        if user.first_login:
            user.first_login = False
        # Validate fields
        user.full_clean(exclude=["password"])
        user.save()

        return UpdateUser(user=user)


class GetIDToken(graphene.Mutation):
    id_token = graphene.String(required=True)

    @login_required
    def mutate(self, info):
        user = info.context.user
        id_token = user.id_token

        return GetIDToken(
            id_token=id_token,
        )
