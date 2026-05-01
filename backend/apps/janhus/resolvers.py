from decorators import permission_required
from django.contrib.auth import get_user_model
from django.db.models import Q
from graphql import GraphQLError
from apps.permissions.constants import HR_TYPE

from apps.janhus.models import (
    JanHusBooking,
    JanHusBookingRequest,
    JanHusBookingSettings,
)
from apps.janhus.permissions import can_edit_guest_list, get_user_email_candidates, normalize_phone_number
from apps.janhus.rules import ensure_area_configurations, ensure_default_levels, get_or_create_settings, resolve_booking_level


def _search_guest_candidates(query, limit=20):
    normalized_query = (query or "").strip()
    if len(normalized_query) < 2:
        return []

    safe_limit = max(1, min(limit or 20, 50))

    user_model = get_user_model()
    search_filter = (
        Q(first_name__icontains=normalized_query)
        | Q(last_name__icontains=normalized_query)
        | Q(phone_number__icontains=normalized_query)
    )

    query_parts = normalized_query.split()
    if len(query_parts) >= 2:
        search_filter |= Q(
            first_name__icontains=query_parts[0],
            last_name__icontains=" ".join(query_parts[1:]),
        )

    users = (
        user_model.objects.filter(search_filter)
        .exclude(feide_userid__isnull=True)
        .exclude(feide_userid="")
        .order_by("first_name", "last_name", "username")
    )

    results = []
    seen_feide_ids: set[str] = set()
    for search_result in users[:safe_limit]:
        feide_userid = (search_result.feide_userid or "").strip()
        if not feide_userid or feide_userid in seen_feide_ids:
            continue

        seen_feide_ids.add(feide_userid)
        display_name = (
            f"{search_result.first_name} {search_result.last_name}".strip()
            or search_result.username
            or feide_userid
        )

        results.append(
            {
                "feide_userid": feide_userid,
                "display_name": display_name,
            }
        )

    return results


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

    def resolve_janhus_my_bookings(self, info):
        user = info.context.user
        if not user or not user.is_authenticated:
            return JanHusBooking.objects.none()

        contact_filters = Q(pk__in=[])

        for email in {email for email in get_user_email_candidates(user) if email}:
            contact_filters |= Q(booker_email__iexact=email)
            contact_filters |= Q(responsible_email__iexact=email)

        normalized_phone_number = normalize_phone_number(getattr(user, "phone_number", ""))
        if normalized_phone_number:
            contact_filters |= Q(booker_phone__icontains=normalized_phone_number)
            contact_filters |= Q(responsible_phone__icontains=normalized_phone_number)

        organization_leader_filter = Q(
            owner_organization__members__user=user,
            owner_organization__members__group__group_type=HR_TYPE,
        )

        return (
            JanHusBooking.objects.exclude(status__in=["DECLINED", "CANCELLED"])
            .filter(Q(owner_user=user) | organization_leader_filter | contact_filters)
            .distinct()
            .order_by("-starts_at")
        )

    def resolve_janhus_guest_search(self, info, booking_id, query, limit=20):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Authentication required")

        booking = JanHusBooking.objects.filter(id=booking_id).first()
        if not booking:
            raise GraphQLError("Booking not found")

        if not can_edit_guest_list(user, booking):
            raise GraphQLError("You do not have permission to edit the guest list for this booking")

        return _search_guest_candidates(query=query, limit=limit)

    def resolve_janhus_guest_search_for_request(self, info, query, limit=20):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Authentication required")

        return _search_guest_candidates(query=query, limit=limit)

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
