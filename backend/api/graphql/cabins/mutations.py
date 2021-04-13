import graphene

from django.utils import timezone

from .types import BookingType
from apps.cabins.models import Booking as BookingModel
from apps.cabins.models import Cabin as CabinModel
from .mail import send_mails
from .validators import create_booking_validation


class BookingInput(graphene.InputObjectType):
    firstname = graphene.String()
    surname = graphene.String()
    phone = graphene.String()
    receiver_email = graphene.String()
    check_in = graphene.Date()
    check_out = graphene.Date()
    internal_participants = graphene.Int()
    external_participants = graphene.Int()
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

        # Validations
        create_booking_validation(booking_data)

        booking = BookingModel()
        for input_field, input_value in booking_data.items():
            if input_field != "cabins":
                setattr(booking, input_field, input_value)
        booking.timestamp = timezone.now()
        booking.save()
        booking.cabins.set(CabinModel.objects.filter(id__in=booking_data.cabins))
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
