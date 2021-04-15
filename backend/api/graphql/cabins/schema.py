import graphene

from api.graphql.cabins.types import BookingType, CabinType
from api.graphql.cabins.mutations import (
    BookingMutation,
    SendEmail,
)
from api.graphql.cabins.resolvers import CabinResolvers


class CabinMutations(graphene.ObjectType):
    mutate_booking = BookingMutation.Field()
    send_email = SendEmail.Field()


class CabinQueries(graphene.ObjectType, CabinResolvers):
    all_bookings = graphene.List(
        BookingType,
        before=graphene.String(required=False),
        after=graphene.String(required=False),
    )
    cabins = graphene.List(CabinType)
