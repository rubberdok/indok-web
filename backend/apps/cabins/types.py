import graphene
from graphene_django import DjangoObjectType
import graphene

from .models import Booking as BookingModel, Cabin as CabinModel


class AllBookingsType(DjangoObjectType):
    """
    Booking type for fields available for not logged in users
    """

    class Meta:
        model = BookingModel
        fields = [
            "id",
            "check_in",
            "check_out",
            "cabins",
        ]


class AdminBookingType(DjangoObjectType):
    """
    Booking type for admin users
    """

    price = graphene.Int(source="price")
    number_of_nights = graphene.Int(source="number_of_nights")
    is_internal_price = graphene.Int(source="is_internal_price")

    class Meta:
        model = BookingModel


class CabinType(DjangoObjectType):
    class Meta:
        model = CabinModel
        fields = ["id", "name", "max_guests", "internal_price", "external_price"]
