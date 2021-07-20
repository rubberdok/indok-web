from apps.cabins.models import Booking as BookingModel, Cabin
from graphql_jwt.decorators import login_required, permission_required


class CabinResolvers:
    def resolve_all_bookings(self, info):
        """
        Fetch all bookings sorted by the their check-in date
        """
        return BookingModel.objects.all().order_by("check_in")

    @login_required
    @permission_required("cabins.view_booking")
    def resolve_admin_all_bookings(self, root, **kwargs):
        """
        This admin view lets the user see more fields in the booking object through the AdminBookingType in the schema.
        However, the user needs view access to bookings.
        """
        query = BookingModel.objects.all().order_by("check_in")
        if kwargs.get("before"):
            query = query.filter(check_in__lt=kwargs.get("before"))
        if kwargs.get("after"):
            query = query.filter(check_in__gt=kwargs.get("after"))
        return query

    def resolve_cabins(self, info):
        """
        Returns all cabins in the database
        """
        return Cabin.objects.all()
