import graphene
from apps.events.models import Category, Event
from graphene_django import DjangoObjectType


class EventType(DjangoObjectType):
    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "starttime",
            "endtime",
            "location",
            "description",
            "organization",
            "category",
            "image",
            "is_attendable",
            "deadline",
            "publisher",
        ]


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]
