import graphene

from django.utils import timezone

from .helpers import price
from .types import BookingType
from apps.cabins.models import Booking as BookingModel
from apps.cabins.models import Cabin as CabinModel
from .mail import send_admin_reservation_mail, send_user_reservation_mail
from .validators import create_booking_validation


class BookingInput(graphene.InputObjectType):
    id = graphene.ID()
    firstname = graphene.String()
    lastname = graphene.String()
    phone = graphene.String()
    receiver_email = graphene.String()
    check_in = graphene.Date()
    check_out = graphene.Date()
    internal_participants = graphene.Int()
    external_participants = graphene.Int()
    cabins = graphene.List(graphene.Int)
    is_tentative = graphene.Boolean()


class EmailInput(BookingInput):
    email_type = graphene.String()


class BookingMutation(graphene.Mutation):
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
        if booking_data.id and BookingModel.objects.filter(pk=booking_data.id).exists():
            booking = BookingModel.objects.get(pk=booking_data.id)
        else:
            booking = BookingModel()
        for input_field, input_value in booking_data.items():
            if input_field and input_field != "cabins":
                setattr(booking, input_field, input_value)
        booking.timestamp = timezone.now()
        booking.save()
        if not booking.id:
            booking.cabins.set(CabinModel.objects.filter(id__in=booking_data.cabins))
            booking.save()
        ok = True
        return BookingMutation(booking=booking, ok=ok)


class SendEmail(graphene.Mutation):
    class Arguments:
        email_input = EmailInput()

    ok = graphene.Boolean()

    def mutate(self, info, email_input):
        cabins = CabinModel.objects.all().filter(id__in=email_input.cabins)
        chosen_cabins_names = [cabin.name for cabin in cabins]
        chosen_cabins_string = (
            cabins[0].name
            if len(cabins) == 1
            else ",".join(chosen_cabins_names[:-1]) + f" og {chosen_cabins_names[-1]}"
        )

        booking_info = {
            **vars(email_input),
            "chosen_cabins_string": chosen_cabins_string,
            "price": price(
                cabins,
                email_input.check_in,
                email_input.check_out,
                email_input.internal_participants,
                email_input.external_participants,
            ),
            "check_in": email_input.check_in.strftime("%d-%m-%Y"),
            "check_out": email_input.check_out.strftime("%d-%m-%Y"),
        }

        # Send different mails for reservation and confirmation
        if email_input.email_type == "reserve_booking":
            send_admin_reservation_mail(booking_info)
            send_user_reservation_mail(booking_info)
        elif email_input.email_type == "confirm_booking":
            pass

        return SendEmail(ok=True)
