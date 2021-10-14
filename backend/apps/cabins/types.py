from datetime import date
from typing import TypedDict, Literal

from django.db.models import QuerySet
from graphene_django import DjangoObjectType
import graphene

from .models import Booking as BookingModel, Cabin as CabinModel, BookingResponsible


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


class BookingResponsibleType(DjangoObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    phone = graphene.Int()
    email = graphene.String()
    active = graphene.Boolean()

    class Meta:
        model = BookingResponsible


EmailTypes = Literal["reserve_booking", "approve_booking", "disapprove_booking"]


class EmailInputType(TypedDict):
    first_name: str
    last_name: str
    receiver_email: str
    phone: str
    internal_participants: int
    external_participants: int
    email_type: EmailTypes
    cabins: QuerySet
    check_in: date
    check_out: date


class BookingInfoType(EmailInputType):
    price: int


class UserTemplateType(TypedDict):
    reserve_subject: str
    decision_subject: str
    reserve_booking: str
    approve_booking: str
    disapprove_booking: str


class AdminTemplateType(TypedDict):
    reserve_subject: str
    reserve_booking: str
