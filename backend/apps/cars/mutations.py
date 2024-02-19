import graphene
from graphene import NonNull
from decorators import permission_required

from apps.cars.models import CarBooking as CarBookingModel
from apps.cars.models import CarBookingSemester
from apps.cars.models import Car as CarModel

from .constants import APPROVE_BOOKING, DISAPPROVE_BOOKING
from .helpers import price
from .mail import send_mail
from .types import AllCarBookingsType, CarBookingInfoType, CarType, CarEmailInputType, UpdateCarBookingSemesterType
from .validators import create_car_booking_validation


class CarBookingInput(graphene.InputObjectType):
    """
    Basic car_booking object type used as a base for other types and as a standalone
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


class CarEmailInput(CarBookingInput):
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
    internal_price_weekend = graphene.Int()
    external_price = graphene.Int()
    external_price_weekend = graphene.Int()


class CreateCarBooking(graphene.Mutation):
    """
    Add a new car_booking to the database
    """

    class Arguments:
        car_booking_data = CarBookingInput()

    ok = graphene.Boolean()
    car_booking = graphene.Field(AllCarBookingsType)

    def mutate(
        self,
        info,
        car_booking_data,
    ):
        ok = True
        # Check that incoming fields are ok
        semester = CarBookingSemester.objects.first()
        create_car_booking_validation(car_booking_data, car_booking_semester=semester)
        car_booking = CarBookingModel()
        for input_field, input_value in car_booking_data.items():
            if input_field and input_field != "cars":
                setattr(car_booking, input_field, input_value)
        car_booking.is_tentative = True
        car_booking.save()
        car_booking.cars.set(CarModel.objects.filter(id__in=car_booking_data.cars))

        return CreateCarBooking(car_booking=car_booking, ok=ok)


class UpdateCarBooking(graphene.Mutation):
    """
    Change the given car_booking
    """

    class Arguments:
        car_booking_data = UpdateCarBookingInput()

    ok = graphene.Boolean()
    car_booking = graphene.Field(AllCarBookingsType)

    @permission_required("cars.manage_car_booking")
    def mutate(
        self,
        info,
        car_booking_data,
    ):
        ok = True
        # Fetch car_booking object if id is provided
        try:
            car_booking = CarBookingModel.objects.get(pk=car_booking_data.id)
            # Check that incoming fields are ok
            semester = CarBookingSemester.objects.first()
            create_car_booking_validation(car_booking_data, car_booking_semester=semester)
            for input_field, input_value in car_booking_data.items():
                if input_field and input_field != "cars":
                    setattr(car_booking, input_field, input_value)
            car_booking.save()
            if car_booking_data.cars:
                car_booking.cars.set(CarModel.objects.filter(id__in=car_booking_data.cars))
                car_booking.save()
            return UpdateCarBooking(car_booking=car_booking, ok=ok)
        except CarBookingModel.DoesNotExist:
            return UpdateCarBooking(
                car_booking=None,
                ok=False,
            )


class DeleteCarBooking(graphene.Mutation):
    """
    Deletes the car_booking with the given ID
    """

    ok = graphene.Boolean()
    car_booking_id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    @permission_required("cars.manage_car_booking")
    def mutate(self, info, id, **kwargs):
        try:
            car_booking = CarBookingModel.objects.get(pk=id)
        except CarBookingModel.DoesNotExist:
            return DeleteCarBooking(ok=False, car_booking_id=id)
        car_booking_id = id
        car_booking.delete()
        return DeleteCarBooking(ok=True, car_booking_id=car_booking_id)


class CarSendEmail(graphene.Mutation):
    """
    Sends email to the user or an admin (or both)
    """

    class Arguments:
        email_input = CarEmailInput()

    ok = graphene.Boolean()

    def mutate(self, info, email_input: CarEmailInputType):
        cars = CarModel.objects.filter(id__in=email_input["cars"])

        car_booking_price = price(
            cars,
            email_input["check_in"],
            email_input["check_out"],
            email_input["internal_participants"],
            email_input["external_participants"],
        )

        car_booking_info: CarBookingInfoType = {
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
            "price": car_booking_price,
            "extra_info": email_input.get("extra_info", ""),
        }

        # Sends an email to the user
        send_mail(car_booking_info=car_booking_info, email_type=email_input["email_type"], admin=False)

        # Don't send mail to admin when approving or disapproving.
        if email_input["email_type"] not in [APPROVE_BOOKING, DISAPPROVE_BOOKING]:
            send_mail(car_booking_info=car_booking_info, email_type=email_input["email_type"], admin=True)

        return CarSendEmail(ok=True)


class UpdateCarBookingSemester(graphene.Mutation):
    """
    Update the car_booking semester
    """

    class Arguments:
        semester_data = UpdateCarBookingSemesterInput()

    ok = graphene.Boolean()
    car_booking_semester = graphene.Field(UpdateCarBookingSemesterType)

    @permission_required("cars.change_car_bookingsemester")
    def mutate(
        self,
        info,
        semester_data,
    ):
        ok = True

        # Fetch first and only CarBookingSemester
        semester = CarBookingSemester.objects.first()

        if not semester:
            # Create new car_booking semester if it doesn't exist
            semester = CarBookingSemester()

        for field, value in semester_data.items():
            setattr(semester, field, value)

        semester.save()
        return UpdateCarBookingSemester(ok=ok, car_booking_semester=semester)


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
