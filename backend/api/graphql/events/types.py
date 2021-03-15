import graphene
from apps.events.models import Category, Event
from django.core.exceptions import PermissionDenied
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from ..users.types import UserType


class UserAttendingType(graphene.ObjectType):
    is_signed_up = graphene.Boolean()
    is_on_waiting_list = graphene.Boolean()


class EventType(DjangoObjectType):
    user_attendance = graphene.Field(UserAttendingType)
    is_full = graphene.Boolean(source="is_full")
    users_on_waiting_list = graphene.List(UserType)
    users_attending = graphene.List(UserType)
    allowed_grade_years_list = graphene.List(graphene.Int)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "start_time",
            "end_time",
            "location",
            "description",
            "organization",
            "category",
            "image",
            "is_attendable",
            "deadline",
            "publisher",
            "available_slots",
            "price",
            "signup_open_date",
            "short_description",
            "has_extra_information",
            "binding_signup",
            "contact_email",
            "allowed_grade_years_list",
        ]

    @staticmethod
    def resolve_user_attendance(event, info):
        user = info.context.user
        return {
            "is_signed_up": user in event.users_attending,
            "is_on_waiting_list": user in event.users_on_waiting_list,
        }

    @staticmethod
    def resolve_allowed_grade_years_list(event, info):
        return [int(grade) for grade in event.allowed_grade_years]

    @staticmethod
    @login_required
    def resolve_users_on_waiting_list(event, info):
        user = info.context.user
        if (
            user.memberships.filter(organization=event.organization).exists()
            or user.is_superuser
        ):
            return event.users_on_waiting_list
        else:
            raise PermissionDenied("Du har ikke tilgang til den forespurte dataen")

    @staticmethod
    @login_required
    def resolve_users_attending(event, info):
        user = info.context.user
        if (
            user.memberships.filter(organization=event.organization).exists()
            or user.is_superuser
        ):
            return event.users_attending
        else:
            raise PermissionDenied("Du har ikke tilgang til den forespurte dataen")


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]
