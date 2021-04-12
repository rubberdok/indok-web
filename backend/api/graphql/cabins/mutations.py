import graphene

from django.utils import timezone

from .types import BookingType
from apps.cabins.models import Booking as BookingModel
from apps.cabins.models import Cabin as CabinModel
from .mail import send_mails
from .validators import (
    checkin_validation,
    email_validation,
    name_validation,
    norwegian_phone_number_validation,
    strip_phone_number,
)


class BookingInput(graphene.InputObjectType):
    firstname = graphene.String()
    surname = graphene.String()
    phone = graphene.Int()
    receiver_email = graphene.String()
    check_in = graphene.Date()
    check_out = graphene.Date()
    price = graphene.Int()
    cabins = graphene.List(graphene.Int)


class CreateBooking(graphene.Mutation):
    class Arguments:
        booking_data = BookingInput()

    ok = graphene.Boolean()
    booking = graphene.Field(BookingType)

    def mutate(
        self,
        info,
        booking_data,
    ):
        checkin_validation(
            booking_data["check_in"], booking_data["check_out"], booking_data["cabins"]
        )
        email_validation(booking_data["receiver_email"])
        name_validation(booking_data["firstname"], booking_data["surname"])
        booking_data["phone"] = strip_phone_number(booking_data["phone"])
        norwegian_phone_number_validation(booking_data["phone"])
        booking = BookingModel()
        for input_field, input_value in booking_data.items():
            if input_field != "cabins":
                setattr(booking, input_field, input_value)
        booking.timestamp = timezone.now()
        booking.save()
        booking.cabins.set(CabinModel.objects.filter(id__in=booking_data.get("cabins")))
        booking.save()
        ok = True
        return CreateBooking(booking=booking, ok=ok)


class SendEmail(graphene.Mutation):
    class Arguments:
        firstname = graphene.String()
        surname = graphene.String()
        receiverEmail = graphene.String()
        bookFrom = graphene.String()
        bookTo = graphene.String()
        price = graphene.Int()

    ok = graphene.Boolean()

    def mutate(self, info, firstname, surname, receiverEmail, bookFrom, bookTo, price):

        send_mails(info, firstname, surname, receiverEmail, bookFrom, bookTo, price)

        ok = True
        return SendEmail(ok=ok)
