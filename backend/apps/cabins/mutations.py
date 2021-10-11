import graphene

from .helpers import price
from .types import AllBookingsType, BookingInfoType, EmailInputType
from apps.cabins.models import Booking as BookingModel
from apps.cabins.models import Cabin as CabinModel
from .constants import APPROVE_BOOKING, DISAPPROVE_BOOKING
from .mail import send_mail
from .validators import create_booking_validation
from graphql_jwt.decorators import permission_required


class BookingInput(graphene.InputObjectType):
    """
    Basic booking object type used as a base for other types and as a standalone
    """

    first_name = graphene.String()
    last_name = graphene.String()
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

    @permission_required("cabins.add_booking")
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
        booking.is_tentative = True
        booking.save()
        booking.cabins.set(CabinModel.objects.filter(id__in=booking_data.cabins))

        return CreateBooking(booking=booking, ok=ok)


class UpdateBooking(graphene.Mutation):
    """
    Change the given booking
    """

    class Arguments:
        booking_data = UpdateBookingInput()

    ok = graphene.Boolean()
    booking = graphene.Field(AllBookingsType)

    @permission_required("cabins.change_booking")
    def mutate(
        self,
        info,
        booking_data,
    ):
        ok = True
        # Fetch booking object if id is provided
        try:
            booking = BookingModel.objects.get(pk=booking_data.id)
            # Check that incoming fields are ok
            create_booking_validation(booking_data)
            for input_field, input_value in booking_data.items():
                if input_field and input_field != "cabins":
                    setattr(booking, input_field, input_value)
            booking.save()
            if booking_data.cabins:
                booking.cabins.set(CabinModel.objects.filter(id__in=booking_data.cabins))
                booking.save()
            return UpdateBooking(booking=booking, ok=ok)
        except BookingModel.DoesNotExist:
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

    @permission_required("cabins.delete_booking")
    def mutate(self, info, id, **kwargs):
        try:
            booking = BookingModel.objects.get(pk=id)
        except BookingModel.DoesNotExist:
            return DeleteBooking(ok=False, booking_id=id)
        booking_id = id
        booking.delete()
        return DeleteBooking(ok=True, booking_id=booking_id)


class SendEmail(graphene.Mutation):
    class Arguments:
        email_input = EmailInput()

    ok = graphene.Boolean()

    @permission_required("cabins.send_email")
    def mutate(self, info, email_input: EmailInputType):
        cabins = CabinModel.objects.filter(id__in=email_input["cabins"])

        booking_price = price(
            cabins,
            email_input["check_in"],
            email_input["check_out"],
            email_input["internal_participants"],
            email_input["external_participants"],
        )

        booking_info: BookingInfoType = {
            "first_name": email_input["first_name"],
            "last_name": email_input["last_name"],
            "receiver_email": email_input["receiver_email"],
            "phone": email_input["phone"],
            "internal_participants": email_input["internal_participants"],
            "external_participants": email_input["external_participants"],
            "email_type": email_input["email_type"],
            "check_in": email_input["check_in"],
            "check_out": email_input["check_out"],
            "cabins": cabins,
            "price": booking_price,
        }

        # Sends an email to the user
        send_mail(booking_info=booking_info, email_type=email_input["email_type"], admin=False)

        # Don't send mail to admin when approving or disapproving.
        if email_input["email_type"] not in [APPROVE_BOOKING, DISAPPROVE_BOOKING]:
            send_mail(booking_info=booking_info, email_type=email_input["email_type"], admin=True)

        return SendEmail(ok=True)
