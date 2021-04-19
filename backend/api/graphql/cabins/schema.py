import graphene

from api.graphql.cabins.types import AllBookingsType, CabinType, AdminBookingType
from api.graphql.cabins.mutations import (
    CreateBooking,
    UpdateBooking,
    SendEmail,
)
from api.graphql.cabins.resolvers import CabinResolvers


class CabinMutations(graphene.ObjectType):
    create_booking = CreateBooking.Field()
    update_booking = UpdateBooking.Field()
    send_email = SendEmail.Field()


class CabinQueries(graphene.ObjectType, CabinResolvers):
    all_bookings = graphene.List(AllBookingsType)
    admin_all_bookings = graphene.List(
        AdminBookingType,
        before=graphene.String(required=False),
        after=graphene.String(required=False),
    )
    cabins = graphene.List(CabinType)
