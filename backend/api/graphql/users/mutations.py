from django.core.exceptions import ValidationError
import graphene
from api.auth.dataporten_auth import DataportenAuth
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token

from .types import UserType


class AuthUser(graphene.Mutation):
    class Arguments:
        code = graphene.String()

    token = graphene.String()
    user = graphene.Field(UserType)
    is_indok_student = graphene.Boolean()
    id_token = graphene.String()

    def mutate(self, info, code):
        user, enrolled, id_token = DataportenAuth.authenticate_and_get_user(code=code)

        if enrolled:
            token = get_token(user)
            info.context.set_jwt_cookie = token
        else:
            token = None

        return AuthUser(
            user=user,
            token=token,
            is_indok_student=enrolled,
            id_token=id_token,
        )


class UpdateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        first_name = graphene.String()
        last_name = graphene.String()
        year = graphene.Int()
        phone_number = graphene.String()
        allergies = graphene.String()

    user = graphene.Field(UserType)

    def mutate(
        self,
        info,
        email=None,
        first_name=None,
        last_name=None,
        year=None,
        phone_number=None,
        allergies=None,
    ):
        user = info.context.user
        first_login = user.first_login
        if first_login:
            first_login = False

        # TODO: fix validation. both phoneNumberField and emailFiled should validate automatically?

        if year and year not in range(1, 6):
            raise ValidationError(
                "Du må oppgi et gyldig årstrinn", params={"year": year}
            )
        if phone_number:
            valid = True
            if phone_number.startswith("+"):
                valid = phone_number[1:].isnumeric() and len(phone_number[3:]) == 8
            else:
                valid = phone_number.isnumeric() and len(phone_number) == 8
            if not valid:
                raise ValidationError(
                    "Ugyldig telefonnummer",
                    params={"phone_number": phone_number},
                )

        if user.email:
            email = email if email is not None else user.email
        else:
            email = email if email is not None else user.feide_email
        user.email = email
        user.first_name = first_name if first_name is not None else user.first_name
        user.last_name = last_name if last_name is not None else user.last_name
        user.year = year if year is not None else user.year
        user.phone_number = (
            phone_number if phone_number is not None else user.phone_number
        )
        user.allergies = allergies if allergies is not None else user.allergies
        user.first_login = first_login
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
