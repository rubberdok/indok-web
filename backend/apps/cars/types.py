from datetime import date
from typing import TypedDict, Literal

from django.db.models import QuerySet
from graphene_django import DjangoObjectType
import graphene

from .models import CarBooking as CarBookingModel, Car as CarModel, CarBookingResponsible, CarBookingSemester


class AllCarBookingsType(DjangoObjectType):
    """
    CarBooking type for fields available for not logged in users
    """

    class Meta:
        model = CarBookingModel
        fields = [
            "id",
            "check_in",
            "check_out",
            "cars",
        ]


class AdminCarBookingType(DjangoObjectType):
    """
    CarBooking type for admin users
    """

    price = graphene.Int(source="price")
    number_of_nights = graphene.Int(source="number_of_nights")
    is_internal_price = graphene.Int(source="is_internal_price")

    class Meta:
        model = CarBookingModel


class CarType(DjangoObjectType):
    class Meta:
        model = CarModel
        fields = [
            "id",
            "name",
            "max_guests",
            "internal_price",
            "external_price",
            "internal_price_weekend",
            "external_price_weekend",
        ]


class CarBookingResponsibleType(DjangoObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    phone = graphene.Int()
    email = graphene.String()
    active = graphene.Boolean()

    class Meta:
        model = CarBookingResponsible


class UpdateCarBookingSemesterType(DjangoObjectType):
    class Meta:
        model = CarBookingSemester


EmailTypes = Literal["reserve_car_booking", "approve_car_booking", "disapprove_car_booking"]


class CarEmailInputType(TypedDict):
    first_name: str
    last_name: str
    receiver_email: str
    phone: str
    internal_participants: int
    external_participants: int
    email_type: EmailTypes
    cars: QuerySet
    check_in: date
    check_out: date
    extra_info: str


class CarBookingInfoType(CarEmailInputType):
    price: int


class CarUserTemplateType(TypedDict):
    reserve_subject: str
    decision_subject: str
    reserve_car_booking: str
    approve_car_booking: str
    disapprove_car_booking: str


class CarAdminTemplateType(TypedDict):
    reserve_subject: str
    reserve_car_booking: str
