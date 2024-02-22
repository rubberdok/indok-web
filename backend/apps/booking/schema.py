import graphene
from graphene import NonNull

from apps.booking.types import (
    AllBookingsType,
    CabinType,
    AdminBookingType,
    BookingResponsibleType,
    UpdateBookingSemesterType,
)
from apps.booking.mutations import (
    CreateBooking,
    UpdateBooking,
    DeleteBooking,
    SendEmail,
    UpdateBookingSemester,
    UpdateProduct,
)
from apps.booking.resolvers import BookingResolvers


class BookingMutations(graphene.ObjectType):
    create_booking = CreateBooking.Field()
    update_booking = UpdateBooking.Field()
    delete_booking = DeleteBooking.Field()
    send_email = SendEmail.Field()
    update_booking_semester = UpdateBookingSemester.Field()
    update_cabin = UpdateProduct.Field()


class BookingQueries(graphene.ObjectType, BookingResolvers):
    all_bookings = graphene.List(NonNull(AllBookingsType))
    admin_all_bookings = graphene.List(
        NonNull(AdminBookingType),
        before=graphene.String(required=False),
        after=graphene.String(required=False),
    )
    cabins = graphene.List(NonNull(CabinType))
    active_booking_responsible = graphene.Field(BookingResponsibleType)
    booking_semester = graphene.Field(UpdateBookingSemesterType)
