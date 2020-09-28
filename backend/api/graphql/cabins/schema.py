import graphene

from graphene import Argument
from graphene_django import DjangoObjectType
from datetime import datetime
from django.shortcuts import get_object_or_404

from api.graphql.cabins.types import BookingType


class BookingQueries(graphene.ObjectType):
    all_bookings = graphene.List(BookingType)

    def resolve_all_bookings(self, root):
        return BookingModel.objects.all()
