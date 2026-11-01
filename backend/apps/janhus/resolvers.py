from decorators import permission_required
from django.contrib.auth import get_user_model
from django.db.models import Q
from graphql import GraphQLError
from apps.permissions.constants import HR_TYPE

from apps.janhus.door_access import with_leader_count
from apps.janhus.guest_list import prefetch_guest_list_entries
from apps.janhus.models import (
    JanHusArea,
    JanHusBooking,
    JanHusBookingRequest,
)
from apps.janhus.permissions import (
    can_edit_guest_list,
    get_hr_organizations,
    get_user_email_candidates,
    normalize_phone_number,
)
from apps.janhus.rules import (
    ensure_default_areas,
    get_or_create_settings,
)

# Everything the admin and "my bookings" lists show of a booking, in one query.
BOOKING_LIST_RELATIONS = (
    "area",
    "owner_user",
    "owner_organization",
    "vipps_product",
    "vipps_order",
    "booker_user",
    "responsible_user",
)


def _search_users_for_booking(query, limit=10):
    """
    Website users a JanHus admin can link to a booking as booker or responsible
    person: by name, email or phone, active users only.
    """
    normalized_query = (query or "").strip()
    if len(normalized_query) < 2:
        return []

    safe_limit = max(1, min(limit or 10, 25))
    search_filter = (
        Q(first_name__icontains=normalized_query)
        | Q(last_name__icontains=normalized_query)
        | Q(email__icontains=normalized_query)
        | Q(feide_email__icontains=normalized_query)
        | Q(phone_number__icontains=normalized_query)
    )
    query_parts = normalized_query.split()
    if len(query_parts) >= 2:
        search_filter |= Q(
            first_name__icontains=query_parts[0],
            last_name__icontains=" ".join(query_parts[1:]),
        )

    users = (
        get_user_model()
        .objects.filter(search_filter, is_active=True)
        .order_by("first_name", "last_name", "username")[:safe_limit]
    )
    return [
        {
            "id": user.id,
            "display_name": f"{user.first_name} {user.last_name}".strip() or user.username,
            "email": user.email or user.feide_email or "",
        }
        for user in users
    ]


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
            f"{search_result.first_name} {search_result.last_name}".strip() or search_result.username or feide_userid
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
        query = (
            JanHusBooking.objects.exclude(status__in=["DECLINED", "CANCELLED"])
            .select_related("area", "owner_user", "owner_organization")
            .order_by("starts_at")
        )

        if kwargs.get("starts_at"):
            query = query.filter(ends_at__gte=kwargs.get("starts_at"))
        if kwargs.get("ends_at"):
            query = query.filter(starts_at__lte=kwargs.get("ends_at"))
        if kwargs.get("area"):
            query = query.filter(area_id=kwargs.get("area"))

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

        return prefetch_guest_list_entries(
            JanHusBooking.objects.filter(Q(owner_user=user) | organization_leader_filter | contact_filters)
            .distinct()
            .select_related(*BOOKING_LIST_RELATIONS)
            .order_by("-starts_at")
        )

    def resolve_janhus_my_booking_requests(self, info):
        user = info.context.user
        if not user or not user.is_authenticated:
            return JanHusBookingRequest.objects.none()

        contact_filters = Q(pk__in=[])

        for email in {email for email in get_user_email_candidates(user) if email}:
            contact_filters |= Q(requester_email__iexact=email)
            contact_filters |= Q(responsible_email__iexact=email)

        normalized_phone_number = normalize_phone_number(getattr(user, "phone_number", ""))
        if normalized_phone_number:
            contact_filters |= Q(requester_phone__icontains=normalized_phone_number)
            contact_filters |= Q(responsible_phone__icontains=normalized_phone_number)

        organization_leader_filter = Q(
            owner_organization__members__user=user,
            owner_organization__members__group__group_type=HR_TYPE,
        )

        return (
            JanHusBookingRequest.objects.filter(Q(requester_user=user) | organization_leader_filter | contact_filters)
            .distinct()
            .select_related("area", "owner_organization", "requester_user")
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

    @permission_required(["janhus.manage_booking", "janhus.view_all_bookings"], any_perm=True)
    def resolve_admin_janhus_bookings(self, root, **kwargs):
        query = with_leader_count(JanHusBooking.objects.select_related(*BOOKING_LIST_RELATIONS)).order_by("starts_at")
        if kwargs.get("status"):
            query = query.filter(status=kwargs.get("status"))
        return prefetch_guest_list_entries(query)

    @permission_required("janhus.manage_booking")
    def resolve_janhus_user_search(self, root, query, limit=10):
        return _search_users_for_booking(query=query, limit=limit)

    def resolve_janhus_bookable_organizations(self, info):
        """
        Organizations the current user may book JanHus for, i.e. the ones
        where they hold the HR ("leader") group.
        """
        return get_hr_organizations(info.context.user).order_by("name")

    def resolve_janhus_booking_settings(self, info):
        return get_or_create_settings()

    def resolve_janhus_areas(self, _info, include_inactive=False):
        ensure_default_areas()
        if include_inactive:
            return JanHusArea.objects.all()
        return JanHusArea.objects.filter(is_active=True)

    @permission_required(["janhus.manage_booking", "janhus.view_all_bookings"], any_perm=True)
    def resolve_janhus_booking_requests(self, root, **kwargs):
        query = JanHusBookingRequest.objects.select_related("area", "owner_organization", "requester_user").order_by(
            "-created_at"
        )
        if kwargs.get("status"):
            query = query.filter(status=kwargs.get("status"))
        return query
