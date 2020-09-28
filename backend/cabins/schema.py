import graphene

from graphene import Argument
from graphene_django import DjangoObjectType
from datetime import datetime
from django.shortcuts import get_object_or_404

from .models import Cabin as CabinModel
from .models import Booking as BookingModel


class BookingType(DjangoObjectType):
    class Meta:
        model = BookingModel


class CabinType(DjangoObjectType):
    class Meta:
        model = CabinModel


class BookingQueries(graphene.ObjectType):
    all_bookings = graphene.List(BookingType)

    def resolve_all_bookings(self, root):
        return BookingModel.objects.all()
