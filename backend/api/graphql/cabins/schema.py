import graphene
from graphene_django import DjangoObjectType
from django.shortcuts import get_object_or_404

from .types import BookingType
from .mutations import CreateBooking, UpdateBooking, DeleteBooking
from .resolvers import BookingResolvers


class BookingMutations(graphene.ObjectType):
    create_booking = CreateBooking.Field()
    update_booking = UpdateBooking.Field()
    delete_booking = DeleteBooking.Field()


class BookingQueries(graphene.ObjectType, BookingResolvers):
    all_bookings = graphene.List(BookingType)
    bookings_by_month = graphene.List(
        BookingType, year=graphene.String(), month=graphene.String()
    )
    booking = graphene.Field(BookingType, booking_id=graphene.ID(required=True))
