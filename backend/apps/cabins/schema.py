import graphene

from apps.cabins.types import BookingType, CabinType
from apps.cabins.mutations import (
    CreateBooking,
    SendEmail,
)
from apps.cabins.resolvers import CabinResolvers


class CabinMutations(graphene.ObjectType):
    create_booking = CreateBooking.Field()
    send_email = SendEmail.Field()


class CabinQueries(graphene.ObjectType, CabinResolvers):
    all_bookings = graphene.List(BookingType)
    cabins = graphene.List(CabinType)
