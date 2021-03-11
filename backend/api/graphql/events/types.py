from apps.events.models import Category, Event
from graphene_django import DjangoObjectType
import graphene


class EventType(DjangoObjectType):
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
            "signed_up_users",
        ]


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
