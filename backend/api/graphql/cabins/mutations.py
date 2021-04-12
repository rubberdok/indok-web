import graphene

from django.utils import timezone
from graphql import GraphQLError

from .types import BookingType
from apps.cabins.models import Booking as BookingModel
from apps.cabins.models import Cabin as CabinModel
from .mail import send_mails


def checkin_validation(check_in, check_out, cabin_ids):
    if check_in < timezone.now().date() or check_out < timezone.now().date():
        raise GraphQLError("Input dates are before current time")
    if check_in > check_out:
        raise GraphQLError("invalid input: Checkin is after checkout")
    # https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
    if (
        BookingModel.objects.filter(
            check_in__lte=check_out,
            check_out__gt=check_in,
            cabins__id__in=cabin_ids,
        ).exists()
    ):
        raise GraphQLError("Input dates overlaps existing booking")


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
