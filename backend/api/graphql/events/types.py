from api.graphql.users.types import UserType
from apps.events.models import Category, Event
from graphene_django import DjangoObjectType
import graphene


class EventType(DjangoObjectType):
    users_on_waiting_list = graphene.List(UserType, source="users_on_waiting_list")
    is_full = graphene.Boolean(source="is_full")

    class Meta:
        model = Event


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]


class UserAttendingType(graphene.ObjectType):
    is_signed_up = graphene.Boolean()
    is_on_waitinglist = graphene.Boolean()
    is_full = graphene.Boolean()
