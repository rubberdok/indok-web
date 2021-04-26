import graphene

from django.utils import timezone

from .helpers import price
from .types import AllBookingsType
from apps.cabins.models import Booking as BookingModel
from apps.cabins.models import Cabin as CabinModel
from .mail import send_mail
from .validators import create_booking_validation
from graphql_jwt.decorators import login_required, permission_required


class BookingInput(graphene.InputObjectType):
    firstname = graphene.String()
    lastname = graphene.String()
    phone = graphene.String()
    receiver_email = graphene.String()
    check_in = graphene.Date()
    check_out = graphene.Date()
    internal_participants = graphene.Int()
    external_participants = graphene.Int()
    cabins = graphene.List(graphene.Int)


class EmailInput(BookingInput):
    email_type = graphene.String()


class UpdateBookingInput(BookingInput):
    id = graphene.ID(required=True)
    is_tentative = graphene.Boolean()


class CreateBooking(graphene.Mutation):
    """
    Add a new booking to the database
    """

    class Arguments:
        booking_data = BookingInput()

    ok = graphene.Boolean()
    booking = graphene.Field(AllBookingsType)

    def mutate(
        self,
        info,
        booking_data,
    ):
        ok = True
        # Check that incoming fields are ok
        create_booking_validation(booking_data)
        booking = BookingModel()
        for input_field, input_value in booking_data.items():
            if input_field and input_field != "cabins":
                setattr(booking, input_field, input_value)
        booking.timestamp = timezone.now()
        booking.is_tentative = True
        booking.save()
        booking.cabins.set(CabinModel.objects.filter(id__in=booking_data.cabins))
        booking.save()

        return CreateBooking(booking=booking, ok=ok)


class UpdateBooking(graphene.Mutation):
    """
    Change the given booking
    """

    class Arguments:
        booking_data = UpdateBookingInput()

    ok = graphene.Boolean()
    booking = graphene.Field(AllBookingsType)

    @login_required
    @permission_required("cabins.change_booking")
    def mutate(
        self,
        info,
        booking_data,
    ):
        ok = True
        # Fetch booking object if id is provided
        if BookingModel.objects.filter(pk=booking_data.id).exists():
            booking = BookingModel.objects.get(pk=booking_data.id)
            # Check that incoming fields are ok
            create_booking_validation(booking_data)
            for input_field, input_value in booking_data.items():
                if input_field and input_field != "cabins":
                    setattr(booking, input_field, input_value)
            booking.save()
            if booking_data.cabins:
                booking.cabins.set(
                    CabinModel.objects.filter(id__in=booking_data.cabins)
                )
                booking.save()
            return UpdateBooking(booking=booking, ok=ok)
        else:
            return UpdateBooking(
                booking=None,
                ok=False,
            )


class DeleteBooking(graphene.Mutation):
    """
    Deletes the booking with the given ID
    """

    ok = graphene.Boolean()
    booking_id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required("cabins.delete_booking")
    def mutate(self, info, **kwargs):
        try:
            booking = BookingModel.objects.get(pk=kwargs["id"])
        except BookingModel.DoesNotExist:
            return DeleteBooking(ok=False, booking_id=kwargs["id"])
        listing_id = kwargs["id"]
        booking.delete()
        return DeleteBooking(ok=True, booking_id=listing_id)


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

        # Sends an email to the user
        send_mail(
            booking_info=booking_info, email_type=email_input.email_type, admin=False
        )

        # Don't send mail to admin when approving or disapproving.
        if email_input.email_type not in ["approve_booking", "disapprove_booking"]:
            send_mail(
                booking_info=booking_info, email_type=email_input.email_type, admin=True
            )

        return SendEmail(ok=True)
