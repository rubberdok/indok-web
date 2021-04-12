from apps.cabins.models import Booking as BookingModel, Cabin


class CabinResolvers:
    def resolve_all_bookings(self, root):
        return BookingModel.objects.all()

    def resolve_cabins(self, root):
        return Cabin.objects.all()
