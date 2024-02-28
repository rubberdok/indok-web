import graphene
from graphene import NonNull
from decorators import permission_required

from apps.booking.models import Booking as BookingModel
from apps.booking.models import BookingSemester
from apps.booking.models import Product as ProductModel

from .constants import APPROVE_BOOKING, DISAPPROVE_BOOKING
from .helpers import price
from .mail import send_mail
from .types import AllBookingsType, BookingInfoType, BookingProductType, EmailInputType, UpdateBookingSemesterType
from .validators import create_booking_validation


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
    booking_products = graphene.List(NonNull(graphene.Int))
    extra_info = graphene.String(required=False)


class EmailInput(BookingInput):
    email_type = graphene.String()


class UpdateBookingInput(BookingInput):
    id = graphene.ID(required=True)
    is_tentative = graphene.Boolean()
    is_declined = graphene.Boolean()
    decline_reason = graphene.String(required=False)


class UpdateBookingSemesterInput(graphene.InputObjectType):
    fall_start_date = graphene.Date()
    fall_end_date = graphene.Date()
    spring_start_date = graphene.Date()
    spring_end_date = graphene.Date()
    fall_semester_active = graphene.Boolean()
    spring_semester_active = graphene.Boolean()


class UpdateProductInput(graphene.InputObjectType):
    id = graphene.ID()
    name = graphene.String()
    max_guests = graphene.Int()
    internal_price = graphene.Int()
    internal_price_weekend = graphene.Int()
    external_price = graphene.Int()
    external_price_weekend = graphene.Int()


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
        semester = BookingSemester.objects.first()
        create_booking_validation(booking_data, booking_semester=semester)
        booking = BookingModel()
        for input_field, input_value in booking_data.items():
            if input_field and input_field != "booking_products":
                setattr(booking, input_field, input_value)
        booking.is_tentative = True
        booking.save()
        booking.booking_products.set(ProductModel.objects.filter(id__in=booking_data.booking_products))

        return CreateBooking(booking=booking, ok=ok)


class UpdateBooking(graphene.Mutation):
    """
    Change the given booking
    """

    class Arguments:
        booking_data = UpdateBookingInput()

    ok = graphene.Boolean()
    booking = graphene.Field(AllBookingsType)

    @permission_required("booking.manage_booking")
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
            semester = BookingSemester.objects.first()
            create_booking_validation(booking_data, booking_semester=semester)
            for input_field, input_value in booking_data.items():
                if input_field and input_field != "booking_products":
                    setattr(booking, input_field, input_value)
            booking.save()
            if booking_data.booking_products:
                booking.booking_products.set(ProductModel.objects.filter(id__in=booking_data.booking_products))
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

    @permission_required("booking.manage_booking")
    def mutate(self, info, id, **kwargs):
        try:
            booking = BookingModel.objects.get(pk=id)
        except BookingModel.DoesNotExist:
            return DeleteBooking(ok=False, booking_id=id)
        booking_id = id
        booking.delete()
        return DeleteBooking(ok=True, booking_id=booking_id)


class SendEmail(graphene.Mutation):
    """
    Sends email to the user or an admin (or both)
    """

    class Arguments:
        email_input = EmailInput()

    ok = graphene.Boolean()

    def mutate(self, info, email_input: EmailInputType):
        booking_products = ProductModel.objects.filter(id__in=email_input["booking_products"])

        booking_price = price(
            booking_products,
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
            "booking_products": booking_products,
            "price": booking_price,
            "extra_info": email_input.get("extra_info", ""),
        }

        # Sends an email to the user
        send_mail(booking_info=booking_info, email_type=email_input["email_type"], admin=False)

        # Don't send mail to admin when approving or disapproving.
        if email_input["email_type"] not in [APPROVE_BOOKING, DISAPPROVE_BOOKING]:
            send_mail(booking_info=booking_info, email_type=email_input["email_type"], admin=True)

        return SendEmail(ok=True)


class UpdateBookingSemester(graphene.Mutation):
    """
    Update the booking semester
    """

    class Arguments:
        semester_data = UpdateBookingSemesterInput()

    ok = graphene.Boolean()
    booking_semester = graphene.Field(UpdateBookingSemesterType)

    @permission_required("booking.change_bookingsemester")
    def mutate(
        self,
        info,
        semester_data,
    ):
        ok = True

        # Fetch first and only BookingSemester
        semester = BookingSemester.objects.first()

        if not semester:
            # Create new booking semester if it doesn't exist
            semester = BookingSemester()

        for field, value in semester_data.items():
            setattr(semester, field, value)

        semester.save()
        return UpdateBookingSemester(ok=ok, booking_semester=semester)


class UpdateProduct(graphene.Mutation):
    """
    Change the given product
    """

    class Arguments:
        product_data = UpdateProductInput()

    ok = graphene.Boolean()
    product = graphene.Field(BookingProductType)

    @permission_required("booking.change_product")
    def mutate(self, info, product_data):
        ok = True

        try:
            # Fetch cabin object by id
            product = ProductModel.objects.get(name=product_data.name)

            for input_field, input_value in product_data.items():
                setattr(product, input_field, input_value)
            product.save()

            return UpdateProduct(product=product, ok=ok)
        except ProductModel.DoesNotExist:
            return UpdateProduct(
                product=None,
                ok=False,
            )
