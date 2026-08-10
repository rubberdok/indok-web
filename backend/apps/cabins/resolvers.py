from apps.cabins.models import (
    Booking as BookingModel,
    Cabin,
    BookingResponsible,
    BookingSemester,
)
from decorators import permission_required
from django.db.models import Q


class CabinResolvers:
    def resolve_all_bookings(self, info):
        """
        Fetch all bookings sorted by the their check-in date
        """
        return BookingModel.objects.filter(is_declined=False).order_by("check_in")

    @permission_required("cabins.manage_booking")
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

    def resolve_active_booking_responsible(self, info):
        """
        Returns the first found active booking responsible.
        """
        return BookingResponsible.objects.filter(active=True).first()

    def resolve_booking_semester(self, info):
        return BookingSemester.objects.first()

    def resolve_my_cabin_bookings(self, info):
        user = info.context.user
        if not user or not user.is_authenticated:
            return BookingModel.objects.none()

        email_filters = Q(receiver_email__iexact=user.email)
        if getattr(user, "feide_email", None):
            email_filters |= Q(receiver_email__iexact=user.feide_email)

        return BookingModel.objects.filter(email_filters).order_by("-check_in")
