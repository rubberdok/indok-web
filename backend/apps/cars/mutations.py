import graphene
from graphene import NonNull
from decorators import permission_required

from apps.cars.models import CarBooking as BookingModel
from apps.cars.models import CarBookingSemester
from apps.cars.models import Car as CarModel

from apps.cabins.constants import APPROVE_BOOKING, DISAPPROVE_BOOKING
from apps.cabins.helpers import price
from .mail import send_mail
from .types import AllCarBookingsType, CarBookingInfoType, CarType, EmailInputType, UpdateCarBookingSemesterType
from .validators import create_booking_validation


class CarBookingInput(graphene.InputObjectType):
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
    cars = graphene.List(NonNull(graphene.Int))
    extra_info = graphene.String(required=False)


class EmailCarInput(CarBookingInput):
    email_type = graphene.String()


class UpdateCarBookingInput(CarBookingInput):
    id = graphene.ID(required=True)
    is_tentative = graphene.Boolean()
    is_declined = graphene.Boolean()
    decline_reason = graphene.String(required=False)


class UpdateCarBookingSemesterInput(graphene.InputObjectType):
    fall_start_date = graphene.Date()
    fall_end_date = graphene.Date()
    spring_start_date = graphene.Date()
    spring_end_date = graphene.Date()
    fall_semester_active = graphene.Boolean()
    spring_semester_active = graphene.Boolean()


class UpdateCarInput(graphene.InputObjectType):
    id = graphene.ID()
    name = graphene.String()
    max_guests = graphene.Int()
    internal_price = graphene.Int()
    external_price = graphene.Int()


class CreateCarBooking(graphene.Mutation):
    """
    Add a new booking to the database
    """

    class Arguments:
        booking_data = CarBookingInput()

    ok = graphene.Boolean()
    booking = graphene.Field(AllCarBookingsType)

    def mutate(
        self,
        info,
        booking_data,
    ):
        ok = True
        # Check that incoming fields are ok
        semester = CarBookingSemester.objects.first()
        create_booking_validation(booking_data, booking_semester=semester)
        booking = BookingModel()
        for input_field, input_value in booking_data.items():
            if input_field and input_field != "cars":
                setattr(booking, input_field, input_value)
        booking.is_tentative = True
        booking.save()
        booking.cars.set(CarModel.objects.filter(id__in=booking_data.cars))

        return CreateCarBooking(booking=booking, ok=ok)


class UpdateCarBooking(graphene.Mutation):
    """
    Change the given booking
    """

    class Arguments:
        booking_data = UpdateCarBookingInput()

    ok = graphene.Boolean()
    booking = graphene.Field(AllCarBookingsType)

    @permission_required("cars.manage_booking")
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
            semester = CarBookingSemester.objects.first()
            create_booking_validation(booking_data, booking_semester=semester)
            for input_field, input_value in booking_data.items():
                if input_field and input_field != "cars":
                    setattr(booking, input_field, input_value)
            booking.save()
            if booking_data.cars:
                booking.cars.set(CarModel.objects.filter(
                    id__in=booking_data.cars))
                booking.save()
            return UpdateCarBooking(booking=booking, ok=ok)
        except BookingModel.DoesNotExist:
            return UpdateCarBooking(
                booking=None,
                ok=False,
            )


class DeleteCarBooking(graphene.Mutation):
    """
    Deletes the booking with the given ID
    """

    ok = graphene.Boolean()
    booking_id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    @permission_required("cars.manage_booking")
    def mutate(self, info, id, **kwargs):
        try:
            booking = BookingModel.objects.get(pk=id)
        except BookingModel.DoesNotExist:
            return DeleteCarBooking(ok=False, booking_id=id)
        booking_id = id
        booking.delete()
        return DeleteCarBooking(ok=True, booking_id=booking_id)


class SendEmail(graphene.Mutation):
    """
    Sends email to the user or an admin (or both)
    """

    class Arguments:
        email_input = EmailCarInput()

    ok = graphene.Boolean()

    def mutate(self, info, email_input: EmailInputType):
        cars = CarModel.objects.filter(id__in=email_input["cars"])

        booking_price = price(
            cars,
            email_input["check_in"],
            email_input["check_out"],
            email_input["internal_participants"],
            email_input["external_participants"],
        )

        booking_info: CarBookingInfoType = {
            "first_name": email_input["first_name"],
            "last_name": email_input["last_name"],
            "receiver_email": email_input["receiver_email"],
            "phone": email_input["phone"],
            "internal_participants": email_input["internal_participants"],
            "external_participants": email_input["external_participants"],
            "email_type": email_input["email_type"],
            "check_in": email_input["check_in"],
            "check_out": email_input["check_out"],
            "cars": cars,
            "price": booking_price,
            "extra_info": email_input.get("extra_info", ""),
        }

        # Sends an email to the user
        send_mail(booking_info=booking_info,
                  email_type=email_input["email_type"], admin=False)

        # Don't send mail to admin when approving or disapproving.
        if email_input["email_type"] not in [APPROVE_BOOKING, DISAPPROVE_BOOKING]:
            send_mail(booking_info=booking_info,
                      email_type=email_input["email_type"], admin=True)

        return SendEmail(ok=True)


class UpdateCarBookingSemester(graphene.Mutation):
    """
    Update the booking semester
    """

    class Arguments:
        semester_data = UpdateCarBookingSemesterInput()

    ok = graphene.Boolean()
    booking_semester = graphene.Field(UpdateCarBookingSemesterType)

    @permission_required("cars.change_bookingsemester")
    def mutate(
        self,
        info,
        semester_data,
    ):
        ok = True

        # Fetch first and only BookingSemester
        semester = CarBookingSemester.objects.first()

        if not semester:
            # Create new booking semester if it doesn't exist
            semester = CarBookingSemester()

        for field, value in semester_data.items():
            setattr(semester, field, value)

        semester.save()
        return UpdateCarBookingSemester(ok=ok, booking_semester=semester)


class UpdateCar(graphene.Mutation):
    """
    Change the given car
    """

    class Arguments:
        car_data = UpdateCarInput()

    ok = graphene.Boolean()
    car = graphene.Field(CarType)

    @permission_required("cars.change_car")
    def mutate(self, info, car_data):
        ok = True

        try:
            # Fetch car object by id
            car = CarModel.objects.get(name=car_data.name)

            for input_field, input_value in car_data.items():
                setattr(car, input_field, input_value)
            car.save()

            return UpdateCar(car=car, ok=ok)
        except CarModel.DoesNotExist:
            return UpdateCar(
                car=None,
                ok=False,
            )
