from datetime import date
from typing import TypedDict, Literal

from django.db.models import QuerySet
from graphene_django import DjangoObjectType
import graphene

from .models import Booking as BookingModel, Product as ProductModel, BookingResponsible, BookingSemester


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
            "products",
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


class ProductType(DjangoObjectType):
    class Meta:
        model = ProductModel
        fields = [
            "id",
            "name",
            "max_guests",
            "internal_price",
            "external_price",
            "internal_price_weekend",
            "external_price_weekend",
        ]


class BookingResponsibleType(DjangoObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    phone = graphene.Int()
    email = graphene.String()
    active = graphene.Boolean()

    class Meta:
        model = BookingResponsible


class UpdateBookingSemesterType(DjangoObjectType):
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
    products: QuerySet
    check_in: date
    check_out: date
    extra_info: str


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
