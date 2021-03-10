import graphene
from apps.events.models import Category, Event
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType


class UserAttendingType(graphene.ObjectType):
    is_signed_up = graphene.Boolean()
    is_on_waitinglist = graphene.Boolean()


class EventType(DjangoObjectType):
    user_attendance = graphene.Field(UserAttendingType, user_id=graphene.ID())

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
            "is_full",
        ]

    @staticmethod
    def resolve_user_attendance(event, info, user_id):
        user = get_user_model().objects.get(pk=user_id)
        return {
            "is_signed_up": user in event.signed_up_users.all()
            and user not in event.users_on_waiting_list,
            "is_on_waitinglist": user in event.users_on_waiting_list,
        }


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]



