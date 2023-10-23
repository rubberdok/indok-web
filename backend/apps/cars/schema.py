import graphene
from graphene import NonNull

from apps.cars.types import (
    AllBookingsType,
    CabinType,
    AdminBookingType,
    BookingResponsibleType,
    UpdateBookingSemesterType,
)
from apps.cars.mutations import (
    CreateBooking,
    UpdateBooking,
    DeleteBooking,
    SendEmail,
    UpdateBookingSemester,
    UpdateCabin,
)
from apps.cars.resolvers import CarResolvers


class CarMutations(graphene.ObjectType):
    create_booking = CreateBooking.Field()
    update_booking = UpdateBooking.Field()
    delete_booking = DeleteBooking.Field()
    send_email = SendEmail.Field()
    update_booking_semester = UpdateBookingSemester.Field()
    update_car = UpdateCar.Field()


class CarQueries(graphene.ObjectType, CarResolvers):
    all_bookings = graphene.List(NonNull(AllBookingsType))
    admin_all_bookings = graphene.List(
        NonNull(AdminBookingType),
        before=graphene.String(required=False),
        after=graphene.String(required=False),
    )
    cars = graphene.List(NonNull(CarType))
    active_booking_responsible = graphene.Field(BookingResponsibleType)
    booking_semester = graphene.Field(UpdateBookingSemesterType)
