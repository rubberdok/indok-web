from apps.cabins.models import Booking as BookingModel, Cabin


class CabinResolvers:
    def resolve_all_bookings(self, root, **kwargs):
        query = BookingModel.objects.all()
        if kwargs.get("before"):
            query = query.filter(check_in__lt=kwargs.get("before"))
        if kwargs.get("after"):
            query = query.filter(check_in__gt=kwargs.get("after"))
        return query

    def resolve_cabins(self, root):
        return Cabin.objects.all()
