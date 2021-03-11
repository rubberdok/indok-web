import graphene
from django.shortcuts import get_object_or_404

from .types import BookingType
from apps.cabins.models import Booking as BookingModel
from apps.cabins.models import Cabin as CabinModel
from .mail import send_mails


class CreateBooking(graphene.Mutation):
    class Arguments:
        firstname = graphene.String()
        surname = graphene.String()
        phone = graphene.Int()
        receiverEmail = graphene.String()
        bookFrom = graphene.String()
        bookTo = graphene.String()
        price = graphene.Int()
        cabins = graphene.List(graphene.Int)

    ok = graphene.Boolean()
    booking = graphene.Field(BookingType)

    def mutate(
        self,
        info,
        firstname,
        surname,
        phone,
        receiverEmail,
        bookFrom,
        bookTo,
        price,
        cabins,
    ):
        booking = BookingModel.objects.create(
            firstname=firstname,
            surname=surname,
            phone=phone,
            receiverEmail=receiverEmail,
            bookFrom=bookFrom,
            bookTo=bookTo,
            price=price,
        )
        booking.cabins.set(CabinModel.objects.filter(id__in=cabins))
        ok = True
        return CreateBooking(booking=booking, ok=ok)


# fiks: oppdaterer ikke bookingen...
class UpdateBooking(graphene.Mutation):
    class Arguments:
        booking_id = graphene.ID()
        contact_num = graphene.Int()
        contact_person = graphene.String()
        start_day = graphene.String()  # string "yyyy-mm-dd"
        end_day = graphene.String()

    ok = graphene.Boolean()
    booking = graphene.Field(BookingType)

    def mutate(
        root,
        info,
        booking_id,
        contact_num=None,
        contact_person=None,
        start_day=None,
        end_day=None,
    ):
        booking = get_object_or_404(BookingModel, pk=booking_id)
        booking.contact_num = (
            contact_num if contact_num is not None else booking.contact_num
        )
        booking.contact_person = (
            contact_person if contact_person is not None else booking.contact_person
        )
        booking.start_day = start_day if start_day is not None else booking.start_day
        booking.end_day = end_day if end_day is not None else booking.end_day

        ok = True

        return UpdateBooking(booking=booking, ok=ok)


class DeleteBooking(graphene.Mutation):
    class Arguments:
        booking_id = graphene.ID()

    ok = graphene.Boolean()

    def mutate(root, info, booking_id):
        booking = get_object_or_404(BookingModel, pk=booking_id)
        booking.delete()
        ok = True
        return DeleteBooking(ok=ok)


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
