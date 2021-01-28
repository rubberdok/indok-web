from graphene_django import DjangoObjectType

from apps.cabins.models import Cabin as CabinModel
from apps.cabins.models import Booking as BookingModel


class BookingType(DjangoObjectType):
    class Meta:
        model = BookingModel


class CabinType(DjangoObjectType):
    class Meta:
        model = CabinModel
