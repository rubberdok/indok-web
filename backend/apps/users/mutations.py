from typing import TYPE_CHECKING, Optional

import graphene
from api.auth.dataporten_auth import DataportenAuth
from decorators import login_required
from django.contrib.auth import login, logout
from graphene import ResolveInfo

from apps.users.helpers import update_graduation_year

from .types import UserType

if TYPE_CHECKING:
    from apps.users import models


class AuthUser(graphene.Mutation):
    class Arguments:
        code = graphene.String(required=True)

    user = graphene.Field(UserType, required=True)

    def mutate(self, info, code: str):
        user = DataportenAuth.authenticate_and_get_user(code=code)
        login(info.context, user, backend="django.contrib.auth.backends.ModelBackend")
        return AuthUser(
            user=user,
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
        info: ResolveInfo,
        user_data: Optional[dict] = None,
    ) -> Optional["UpdateUser"]:
        if user_data is None:
            return None

        user: "models.User" = info.context.user

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


class Logout(graphene.Mutation):
    id_token = graphene.String()

    @login_required
    def mutate(self, info: ResolveInfo):
        user: "models.User" = info.context.user
        logout(info.context)
        return Logout(id_token=user.id_token)
