from apps.cars.models import CarBooking as BookingModel, Car, CarBookingResponsible, CarBookingSemester
from decorators import permission_required


class CarResolvers:
    def resolve_all_bookings(self, info):
        """
        Fetch all bookings sorted by the their check-in date
        """
        return BookingModel.objects.filter(is_declined=False).order_by("check_in")

    @permission_required("cars.manage_booking")
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

    def resolve_cars(self, info):
        """
        Returns all cars in the database
        """
        return Car.objects.all()

    def resolve_active_booking_responsible(self, info):
        """
        Returns the first found active booking responsible.
        """
        return BookingResponsible.objects.filter(active=True).first()

    def resolve_booking_semester(self, info):
        return BookingSemester.objects.first()
