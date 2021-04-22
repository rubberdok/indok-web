import graphene
from graphene_django import DjangoObjectType
import graphene

from .models import Booking as BookingModel, Cabin as CabinModel


class BookingType(DjangoObjectType):
    price = graphene.Int(source="price")
    number_of_nights = graphene.Int(source="number_of_nights")
    is_internal_price = graphene.Int(source="is_internal_price")

    class Meta:
        model = BookingModel


class CabinType(DjangoObjectType):
    class Meta:
        model = CabinModel
