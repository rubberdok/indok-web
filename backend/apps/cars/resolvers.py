from apps.cars.models import CarBooking as CarBookingModel, Car, CarBookingResponsible, CarBookingSemester
from decorators import permission_required


class CarResolvers:
    def resolve_all_car_bookings(self, info):
        """backend/apps/cars/resolvers.py
        Fetch all car_bookings sorted by the their check-in date
        """
        return CarBookingModel.objects.filter(is_declined=False).order_by("check_in")

    @permission_required("cars.manage_car_booking")
    def resolve_admin_all_car_bookings(self, root, **kwargs):
        """
        This admin view lets the user see more fields in the car_booking object through the AdminCarBookingType in the schema.
        However, the user needs view access to car_bookings.
        """
        query = CarBookingModel.objects.all().order_by("check_in")
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

    def resolve_active_car_booking_responsible(self, info):
        """
        Returns the first found active car_booking responsible.
        """
        return CarBookingResponsible.objects.filter(active=True).first()

    def resolve_car_booking_semester(self, info):
        return CarBookingSemester.objects.first()
