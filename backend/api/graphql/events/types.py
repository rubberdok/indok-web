import graphene
from apps.events.models import Category, Event
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from graphene_django import DjangoObjectType

from ..users.types import UserType


class UserAttendingType(graphene.ObjectType):
    is_signed_up = graphene.Boolean()
    is_on_waiting_list = graphene.Boolean()


class EventType(DjangoObjectType):
    user_attendance = graphene.Field(UserAttendingType)
    is_full = graphene.Boolean(source="is_full")
    users_on_waiting_list = graphene.List(UserType)
    users_attending = graphene.List(UserType)

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
        ]

    @staticmethod
    def resolve_user_attendance(event, info):
        user = info.context.user
        return {
            "is_signed_up": user in event.users_attending,
            "is_on_waiting_list": user in event.users_on_waiting_list,
        }

    @staticmethod
    def resolve_users_on_waiting_list(event, info):
        user = info.context.user
        if user in event.organization.members.all() or user.is_superuser:
            return event.users_on_waiting_list
        else:
            raise PermissionDenied("Du har ikke tilgang til den forespurte dataen")

    @staticmethod
    def resolve_users_attending(event, info):
        user = info.context.user
        if user in event.organization.members.all() or user.is_superuser:
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
