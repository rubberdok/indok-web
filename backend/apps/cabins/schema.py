import graphene

from .mutations import CreateBooking, DeleteBooking, SendEmail, UpdateBooking
from .resolvers import CabinResolvers
from .types import BookingType, CabinType


class CabinMutations(graphene.ObjectType):
    create_Cabin = CreateBooking.Field()
    update_booking = UpdateBooking.Field()
    delete_booking = DeleteBooking.Field()
    send_email = SendEmail.Field()


class CabinQueries(graphene.ObjectType, CabinResolvers):
    all_bookings = graphene.List(BookingType)
    bookings_by_month = graphene.List(
        BookingType, year=graphene.String(), month=graphene.String()
    )
    booking = graphene.Field(BookingType, booking_id=graphene.ID(required=True))
    cabins = graphene.List(CabinType)
