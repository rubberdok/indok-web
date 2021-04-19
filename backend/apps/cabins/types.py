from graphene_django import DjangoObjectType

from .models import Booking as BookingModel, Cabin as CabinModel


class BookingType(DjangoObjectType):
    class Meta:
        model = BookingModel


class CabinType(DjangoObjectType):
    class Meta:
        model = CabinModel
