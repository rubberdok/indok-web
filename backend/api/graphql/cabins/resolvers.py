from apps.cabins.models import Booking as BookingModel, Cabin


class CabinResolvers:
    def resolve_all_bookings(self, root):
        return BookingModel.objects.all()

    def resolve_booking_by_id(self, root, booking_id):
        try:
            return BookingModel.objects.get(pk=booking_id)
        except BookingModel.DoesNotExist:
            return None

    def resolve_bookings_by_month(self, root, year, month):
        in_range_bookings = BookingModel.objects.filter(
            start_day__year=year, start_day__month=month
        )

        return in_range_bookings

    def resolve_cabins(self, root):
        return Cabin.objects.all()
