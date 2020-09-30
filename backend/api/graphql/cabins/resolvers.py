import graphene

from .types import BookingType
from apps.cabins.models import Booking as BookingModel


class BookingResolvers:
    def resolve_all_bookings(self, root):
        return BookingModel.objects.all()

    def resolve_booking_by_id(self, root, booking_id):
        try:
            return BookingModel.objects.get(pk=booking_id)
        except BookingModel.DoesNotExist:
            return None
