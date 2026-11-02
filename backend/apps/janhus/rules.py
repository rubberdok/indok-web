from datetime import date, timedelta
from typing import Optional

from django.db.models import QuerySet
from django.utils import timezone
from graphql import GraphQLError

from apps.janhus.models import (
    JanHusArea,
    JanHusBooking,
    JanHusBookingSettings,
    JanHusBookingStatus,
)


def get_or_create_settings() -> JanHusBookingSettings:
    settings = JanHusBookingSettings.objects.first()
    if not settings:
        settings = JanHusBookingSettings.objects.create()
    return settings


def ensure_default_areas() -> QuerySet[JanHusArea]:
    entire_house, _ = JanHusArea.objects.get_or_create(name="Hele huset")
    JanHusArea.objects.get_or_create(name="1. etasje", defaults={"parent": entire_house})
    JanHusArea.objects.get_or_create(name="2. etasje", defaults={"parent": entire_house})
    return JanHusArea.objects.filter(is_active=True)


def validate_booking_window(*, starts_at, owner_organization, settings: JanHusBookingSettings) -> None:
    """
    How far ahead an end user may request a booking, from the booking settings, so a
    change there counts at once: up to and including the day
    `organization_booking_opens_weeks_before` weeks from today for an organisation, and
    `general_booking_opens_weeks_before` for everyone else, personal and external. The
    booking page offers no later dates. An admin's own booking or approval is not limited.
    """
    if owner_organization is not None:
        who, weeks = "Organisation bookings", settings.organization_booking_opens_weeks_before
    else:
        who, weeks = "Bookings", settings.general_booking_opens_weeks_before
    starts_on = timezone.localtime(starts_at).date() if timezone.is_aware(starts_at) else starts_at.date()
    if starts_on > timezone.localdate() + timedelta(weeks=weeks):
        raise GraphQLError(f"{who} can be made at most {weeks} weeks ahead")


def determine_initial_status(
    *,
    is_external_booking: bool,
    requires_payment: bool = False,
) -> str:
    """
    The status a new booking starts with. It never refuses a booking for being far ahead:
    the windows only limit what end users may request (validate_booking_window).
    External bookings wait for an admin (PENDING_ADMIN_REVIEW, "Venter behandling"), and
    so do bookings nobody has paid for yet. Everything else is CONFIRMED.

    `requires_payment` marks a booking that nobody has paid for yet, which is every
    personal booking at the moment it is created. It becomes CONFIRMED once payment lands
    (signals.confirm_paid_janhus_bookings), so the direct path cannot hand out a
    confirmed booking (and a contract) that the request path would have charged for.

    Booking levels (JanHusBookingLevel, assigned per user or organisation in Django
    admin) used to decide this, and let a "Priority Organization" book any time and
    move provisional bookings to admin review. They were removed in the commit
    "refactor(janhus): fjern bookingnivåer" (git log --grep "fjern bookingnivåer").
    To bring them back: revert that commit but keep its migration 0024, then run
    makemigrations janhus, which makes the tables again in a new migration.
    """
    if is_external_booking or requires_payment:
        return JanHusBookingStatus.PENDING_ADMIN_REVIEW
    return JanHusBookingStatus.CONFIRMED


def get_conflicting_areas(area: JanHusArea) -> list:
    return area.conflicting_area_ids


def get_overlapping_bookings(
    *,
    starts_at,
    ends_at,
    area: JanHusArea,
    exclude_booking_id: Optional[int] = None,
    settings: Optional[JanHusBookingSettings] = None,
):
    """
    Bookings that clash with this time range in this area or any area above or
    below it. When a buffer is configured the range is widened by that many
    minutes at each end, so back-to-back bookings clash and leave a gap for
    cleaning and handover.
    """
    buffer_minutes = settings.buffer_minutes if settings else 0
    if buffer_minutes:
        starts_at = starts_at - timedelta(minutes=buffer_minutes)
        ends_at = ends_at + timedelta(minutes=buffer_minutes)

    query = JanHusBooking.objects.filter(
        starts_at__lt=ends_at,
        ends_at__gt=starts_at,
        area_id__in=get_conflicting_areas(area),
    ).exclude(
        status__in=[
            JanHusBookingStatus.DECLINED,
            JanHusBookingStatus.CANCELLED,
        ]
    )

    if exclude_booking_id:
        query = query.exclude(id=exclude_booking_id)

    return query


def is_in_active_booking_semester(*, target_date: date, settings: JanHusBookingSettings) -> bool:
    in_fall_semester = (
        settings.fall_semester_active and settings.fall_start_date <= target_date <= settings.fall_end_date
    )
    in_spring_semester = (
        settings.spring_semester_active and settings.spring_start_date <= target_date <= settings.spring_end_date
    )
    return in_fall_semester or in_spring_semester


def validate_booking_semester_rules(*, starts_at, ends_at, settings: JanHusBookingSettings):
    if not settings.fall_semester_active and not settings.spring_semester_active:
        raise GraphQLError("None of the booking semesters are active.")

    start_local = timezone.localtime(starts_at) if timezone.is_aware(starts_at) else starts_at
    end_local = timezone.localtime(ends_at) if timezone.is_aware(ends_at) else ends_at

    start_date = start_local.date()
    end_date = end_local.date()

    if not is_in_active_booking_semester(
        target_date=start_date, settings=settings
    ) or not is_in_active_booking_semester(target_date=end_date, settings=settings):
        raise GraphQLError("Dates are outside of active booking semesters.")


def _is_allowed_boundary(
    hour: int,
    minute: int,
    *,
    opening_hour: int,
    closing_hour: int,
    allow_exact_closing: bool,
):
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
