import graphene

from api.graphql.cabins.types import BookingType, CabinType
from api.graphql.cabins.mutations import (
    CreateBooking,
    UpdateBooking,
    DeleteBooking,
    SendEmail,
)
from api.graphql.cabins.resolvers import CabinResolvers


class CabinMutations(graphene.ObjectType):
    create_booking = CreateBooking.Field()
    update_booking = UpdateBooking.Field()
    delete_booking = DeleteBooking.Field()
    send_email = SendEmail.Field()


class CabinQueries(graphene.ObjectType, CabinResolvers):
    all_bookings = graphene.List(BookingType)
    cabins = graphene.List(CabinType)
