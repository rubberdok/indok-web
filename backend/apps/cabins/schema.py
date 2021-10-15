import graphene

from apps.cabins.types import AllBookingsType, CabinType, AdminBookingType, BookingResponsibleType
from apps.cabins.mutations import (
    CreateBooking,
    UpdateBooking,
    DeleteBooking,
    SendEmail,
)
from apps.cabins.resolvers import CabinResolvers


class CabinMutations(graphene.ObjectType):
    create_booking = CreateBooking.Field()
    update_booking = UpdateBooking.Field()
    delete_booking = DeleteBooking.Field()
    send_email = SendEmail.Field()


class CabinQueries(graphene.ObjectType, CabinResolvers):
    all_bookings = graphene.List(AllBookingsType)
    admin_all_bookings = graphene.List(
        AdminBookingType,
        before=graphene.String(required=False),
        after=graphene.String(required=False),
    )
    cabins = graphene.List(CabinType)
    active_booking_responsible = graphene.Field(BookingResponsibleType)
