from decorators import permission_required

from apps.janhus.models import (
    JanHusBooking,
    JanHusBookingRequest,
    JanHusBookingSettings,
)
from apps.janhus.rules import ensure_area_configurations, ensure_default_levels, get_or_create_settings, resolve_booking_level


class JanHusResolvers:
    def resolve_janhus_bookings(self, info, **kwargs):
        query = JanHusBooking.objects.exclude(status__in=["DECLINED", "CANCELLED"]).order_by("starts_at")

        if kwargs.get("starts_at"):
            query = query.filter(ends_at__gte=kwargs.get("starts_at"))
        if kwargs.get("ends_at"):
            query = query.filter(starts_at__lte=kwargs.get("ends_at"))
        if kwargs.get("area"):
            query = query.filter(area=kwargs.get("area"))

        return query

    @permission_required("janhus.manage_booking")
    def resolve_admin_janhus_bookings(self, root, **kwargs):
        query = JanHusBooking.objects.all().order_by("starts_at")
        if kwargs.get("status"):
            query = query.filter(status=kwargs.get("status"))
        return query

    def resolve_janhus_booking_settings(self, info):
        return get_or_create_settings()

    def resolve_janhus_area_configurations(self, info):
        return ensure_area_configurations()

    def resolve_janhus_booking_levels(self, info):
        settings = get_or_create_settings()
        levels = ensure_default_levels(settings)
        return sorted(levels.values(), key=lambda level: (-level.priority, level.name))

    def resolve_janhus_my_booking_level(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return None
        return resolve_booking_level(user=user, owner_organization=None, is_external_booking=False)

    @permission_required("janhus.manage_booking")
    def resolve_janhus_booking_requests(self, root, **kwargs):
        query = JanHusBookingRequest.objects.all().order_by("-created_at")
        if kwargs.get("status"):
            query = query.filter(status=kwargs.get("status"))
        return query
