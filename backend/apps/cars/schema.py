import graphene
from graphene import NonNull

from apps.cars.types import (
    AllCarBookingsType,
    CarType,
    AdminCarBookingType,
    CarBookingResponsibleType,
    UpdateCarBookingSemesterType,
)
from apps.cars.mutations import (
    CreateCarBooking,
    UpdateCarBooking,
    DeleteCarBooking,
    SendEmail,
    UpdateCarBookingSemester,
    UpdateCar,
)
from apps.cars.resolvers import CarResolvers


class CarMutations(graphene.ObjectType):
    create_car_booking = CreateCarBooking.Field()
    update_car_booking = UpdateCarBooking.Field()
    delete_car_booking = DeleteCarBooking.Field()
    send_email = SendEmail.Field()
    update_car_booking_semester = UpdateCarBookingSemester.Field()
    update_car = UpdateCar.Field()


class CarQueries(graphene.ObjectType, CarResolvers):
    all_car_bookings = graphene.List(NonNull(AllCarBookingsType))
    admin_all_car_bookings = graphene.List(
        NonNull(AdminCarBookingType),
        before=graphene.String(required=False),
        after=graphene.String(required=False),
    )
    cars = graphene.List(NonNull(CarType))
    active_car_booking_responsible = graphene.Field(CarBookingResponsibleType)
    car_booking_semester = graphene.Field(UpdateCarBookingSemesterType)
