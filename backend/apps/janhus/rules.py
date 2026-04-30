from datetime import timedelta
from typing import Optional

from django.db.models import QuerySet
from django.utils import timezone
from graphql import GraphQLError

from apps.janhus.models import (
    JanHusArea,
    JanHusAreaConfiguration,
    JanHusBooking,
    JanHusBookingLevel,
    JanHusBookingSettings,
    JanHusBookingStatus,
    JanHusOrganizationBookingLevel,
    JanHusUserBookingLevel,
)


PRIORITY_LEVEL = "Priority Organization"
ORGANIZATION_LEVEL = "Organization"
GENERAL_LEVEL = "General User"
EXTERNAL_LEVEL = "External Request"


def get_or_create_settings() -> JanHusBookingSettings:
    settings = JanHusBookingSettings.objects.first()
    if not settings:
        settings = JanHusBookingSettings.objects.create()
    return settings


def ensure_area_configurations() -> QuerySet[JanHusAreaConfiguration]:
    for area in JanHusArea.values:
        JanHusAreaConfiguration.objects.get_or_create(area=area)
    return JanHusAreaConfiguration.objects.all()


def ensure_default_levels(settings: Optional[JanHusBookingSettings] = None) -> dict[str, JanHusBookingLevel]:
    settings = settings or get_or_create_settings()

    default_levels = [
        {
            "name": PRIORITY_LEVEL,
            "defaults": {
                "description": "Highest non-admin priority level (Big Four equivalent)",
                "priority": 300,
                "can_book_anytime": True,
                "can_create_provisional": False,
                "can_create_confirmed": True,
                "can_override_lower_levels": True,
                "can_edit_own_bookings_only": True,
                "can_edit_all_bookings": False,
                "booking_opens_weeks_before": None,
            },
        },
        {
            "name": ORGANIZATION_LEVEL,
            "defaults": {
                "description": "Default level for organizations",
                "priority": 200,
                "can_book_anytime": False,
                "can_create_provisional": True,
                "can_create_confirmed": True,
                "can_override_lower_levels": False,
                "can_edit_own_bookings_only": True,
                "can_edit_all_bookings": False,
                "booking_opens_weeks_before": settings.organization_booking_opens_weeks_before,
            },
        },
        {
            "name": GENERAL_LEVEL,
            "defaults": {
                "description": "Default level for personal bookings",
                "priority": 100,
                "can_book_anytime": False,
                "can_create_provisional": False,
                "can_create_confirmed": True,
                "can_override_lower_levels": False,
                "can_edit_own_bookings_only": True,
                "can_edit_all_bookings": False,
                "booking_opens_weeks_before": settings.general_booking_opens_weeks_before,
            },
        },
        {
            "name": EXTERNAL_LEVEL,
            "defaults": {
                "description": "External users without login",
                "priority": 50,
                "can_book_anytime": False,
                "can_create_provisional": False,
                "can_create_confirmed": False,
                "can_override_lower_levels": False,
                "can_edit_own_bookings_only": False,
                "can_edit_all_bookings": False,
                "booking_opens_weeks_before": None,
            },
        },
    ]

    levels: dict[str, JanHusBookingLevel] = {}
    for level in default_levels:
        obj, _ = JanHusBookingLevel.objects.get_or_create(name=level["name"], defaults=level["defaults"])
        levels[obj.name] = obj

    return levels


def resolve_booking_level(*, user, owner_organization, is_external_booking: bool) -> JanHusBookingLevel:
    settings = get_or_create_settings()
    levels = ensure_default_levels(settings)

    if is_external_booking:
        return levels[EXTERNAL_LEVEL]

    if owner_organization:
        assignment = (
            JanHusOrganizationBookingLevel.objects.select_related("level")
            .filter(organization=owner_organization)
            .first()
        )
        return assignment.level if assignment else levels[ORGANIZATION_LEVEL]

    if user and user.is_authenticated:
        assignment = JanHusUserBookingLevel.objects.select_related("level").filter(user=user).first()
        return assignment.level if assignment else levels[GENERAL_LEVEL]

    raise GraphQLError("Could not determine booking level")


def booking_weeks_in_advance(starts_at) -> float:
    now = timezone.now()
    return (starts_at - now).total_seconds() / (7 * 24 * 60 * 60)


def determine_initial_status(
    *,
    booking_level: JanHusBookingLevel,
    starts_at,
    is_external_booking: bool,
    settings: JanHusBookingSettings,
) -> str:
    if is_external_booking:
        return JanHusBookingStatus.PENDING_ADMIN_REVIEW

    if booking_level.can_book_anytime and booking_level.can_create_confirmed:
        return JanHusBookingStatus.CONFIRMED

    weeks_in_advance = booking_weeks_in_advance(starts_at)

    open_weeks = booking_level.booking_opens_weeks_before

    if open_weeks is not None and weeks_in_advance > open_weeks:
        if booking_level.can_create_provisional:
            return JanHusBookingStatus.PROVISIONAL
        raise GraphQLError("This booking level cannot create bookings this early")

    if booking_level.can_create_confirmed:
        return JanHusBookingStatus.CONFIRMED

    if booking_level.can_create_provisional:
        return JanHusBookingStatus.PROVISIONAL

    raise GraphQLError("This booking level cannot create bookings")


def can_override_provisionals(
    *,
    booking_level: JanHusBookingLevel,
    starts_at,
    settings: JanHusBookingSettings,
) -> bool:
    if not booking_level.can_override_lower_levels:
        return False
    weeks_in_advance = booking_weeks_in_advance(starts_at)
    return weeks_in_advance > settings.organization_booking_opens_weeks_before


def get_conflicting_areas(area: str) -> list[str]:
    if area == JanHusArea.ENTIRE_HOUSE:
        return [JanHusArea.ENTIRE_HOUSE, JanHusArea.FIRST_FLOOR, JanHusArea.SECOND_FLOOR]
    if area == JanHusArea.FIRST_FLOOR:
        return [JanHusArea.FIRST_FLOOR, JanHusArea.ENTIRE_HOUSE]
    return [JanHusArea.SECOND_FLOOR, JanHusArea.ENTIRE_HOUSE]


def get_overlapping_bookings(*, starts_at, ends_at, area: str, exclude_booking_id: Optional[int] = None):
    query = JanHusBooking.objects.filter(
        starts_at__lt=ends_at,
        ends_at__gt=starts_at,
        area__in=get_conflicting_areas(area),
    ).exclude(
        status__in=[
            JanHusBookingStatus.DECLINED,
            JanHusBookingStatus.CANCELLED,
        ]
    )

    if exclude_booking_id:
        query = query.exclude(id=exclude_booking_id)

    return query


def _is_allowed_boundary(hour: int, minute: int, *, opening_hour: int, closing_hour: int, allow_exact_closing: bool):
    if allow_exact_closing and hour == closing_hour and minute == 0:
        return True

    if opening_hour == closing_hour:
        return True

    if opening_hour < closing_hour:
        if hour < opening_hour:
            return False
        if hour > closing_hour:
            return False
        if hour == closing_hour:
            return False
        return True

    # Wrap-around window, e.g. 08:00 -> 02:00
    return hour >= opening_hour or hour < closing_hour


def validate_time_rules(*, starts_at, ends_at, settings: JanHusBookingSettings):
    if starts_at >= ends_at:
        raise GraphQLError("End time must be after start time")

    duration_minutes = int((ends_at - starts_at).total_seconds() // 60)

    if duration_minutes < settings.min_duration_minutes:
        raise GraphQLError("Booking must be at least the configured minimum duration")

    if duration_minutes % settings.slot_granularity_minutes != 0:
        raise GraphQLError("Booking duration must align with slot granularity")

    start_local = timezone.localtime(starts_at) if timezone.is_aware(starts_at) else starts_at
    end_local = timezone.localtime(ends_at) if timezone.is_aware(ends_at) else ends_at

    window_start = start_local.replace(hour=settings.opening_hour, minute=0, second=0, microsecond=0)
    if settings.opening_hour == settings.closing_hour:
        window_end = window_start + timedelta(days=1)
    else:
        window_end = start_local.replace(hour=settings.closing_hour, minute=0, second=0, microsecond=0)
        if settings.opening_hour >= settings.closing_hour:
            window_end += timedelta(days=1)

    if start_local < window_start or end_local > window_end:
        raise GraphQLError("Booking must be within a single booking day window")

    start_offset_minutes = int((start_local - window_start).total_seconds() // 60)
    end_offset_minutes = int((end_local - window_start).total_seconds() // 60)
    if (
        start_offset_minutes % settings.slot_granularity_minutes != 0
        or end_offset_minutes % settings.slot_granularity_minutes != 0
    ):
        raise GraphQLError("Start and end times must align with slot granularity")

    if not _is_allowed_boundary(
        start_local.hour,
        start_local.minute,
        opening_hour=settings.opening_hour,
        closing_hour=settings.closing_hour,
        allow_exact_closing=False,
    ):
        raise GraphQLError("Start time is outside configured opening hours")

    if not _is_allowed_boundary(
        end_local.hour,
        end_local.minute,
        opening_hour=settings.opening_hour,
        closing_hour=settings.closing_hour,
        allow_exact_closing=True,
    ):
        raise GraphQLError("End time is outside configured opening hours")

    current = starts_at
    while current < ends_at:
        current_local = timezone.localtime(current) if timezone.is_aware(current) else current
        if not _is_allowed_boundary(
            current_local.hour,
            current_local.minute,
            opening_hour=settings.opening_hour,
            closing_hour=settings.closing_hour,
            allow_exact_closing=False,
        ):
            raise GraphQLError("Booking passes through hours that are not bookable")
        current += timedelta(minutes=settings.slot_granularity_minutes)
