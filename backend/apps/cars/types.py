from datetime import date
from typing import TypedDict, Literal

from django.db.models import QuerySet
from graphene_django import DjangoObjectType
import graphene

from .models import Booking as BookingModel, Car as CarModel, BookingResponsible, BookingSemester


class AllCarBookingsType(DjangoObjectType):
    """
    Booking type for fields available for not logged in users
    """

    class Meta:
        model = BookingModel
        fields = [
            "id",
            "check_in",
            "check_out",
            "cars",
        ]


class AdminCarBookingType(DjangoObjectType):
    """
    Booking type for admin users
    """

    price = graphene.Int(source="price")
    number_of_nights = graphene.Int(source="number_of_nights")
    is_internal_price = graphene.Int(source="is_internal_price")

    class Meta:
        model = BookingModel


class CarType(DjangoObjectType):
    class Meta:
        model = CarModel
        fields = ["id", "name", "max_passengers", "internal_price", "external_price"]


class CarBookingResponsibleType(DjangoObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    phone = graphene.Int()
    email = graphene.String()
    active = graphene.Boolean()

    class Meta:
        model = BookingResponsible


class UpdateCarBookingSemesterType(DjangoObjectType):
    class Meta:
        model = BookingSemester


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
    extra_info: str


class CarBookingInfoType(EmailInputType):
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
