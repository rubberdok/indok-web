"""
Who has, will have and has had door access at JanHus, for the NFC page. It uses the same rules as
compute_desired_states, so the page and the door agree. Past periods use today's memberships and only confirmed
bookings: this shows what the rules gave, not who opened the door. That is the door log.
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Optional

from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.janhus.models import JanHusBooking, JanHusBookingStatus
from apps.nfc.models import (
    NfcCardAssignment,
    NfcManualAccess,
    NfcPermanentAccessChange,
    NfcUserNote,
    permanent_access_ends,
)

from .models import ArxAreaMapping, ExternalBookingAccess, get_arx_settings
from .services import (
    _area_descendants,
    _booking_memberships,
    _booking_owner_holders,
    _category_ids_for_area,
    _policy_holders,
    arx_card_number,
    manual_access_people,
    shared_card_numbers,
)

DEFAULT_PAST_DAYS = 1


@dataclass
class AccessPeriod:
    kind: str  # PERMANENT, TEMPORARY, BOOKING, MANUAL or EXTERNAL
    starts_at: Optional[datetime]
    ends_at: Optional[datetime]
    detail: str = ""


@dataclass
class AccessPerson:
    key: str
    user: Optional[object] = None
    holder_name: str = ""
    card_number: str = ""
    periods: list = field(default_factory=list)
    state: str = ""  # NOW, UPCOMING, PAST or NOTE_ONLY
    blocked_reason: str = ""  # INACTIVE_USER, NO_CARD, CARD_DISABLED, NO_PIN or CARD_AMBIGUOUS


@dataclass
class AccessOverview:
    people: list
    past_days: int
    max_past_days: int
    areas_connected: bool


def _state(periods: list, now) -> str:
    if any((p.starts_at is None or p.starts_at <= now) and (p.ends_at is None or now < p.ends_at) for p in periods):
        return "NOW"
    if any(p.starts_at is not None and p.starts_at > now for p in periods):
        return "UPCOMING"
    return "PAST"


def _card_blocked_reason(card, has_pin: bool, shared: dict, digits: int) -> str:
    if card is None or not card.mifare_csn.isdigit():
        return "NO_CARD"
    if not card.is_enabled:
        return "CARD_DISABLED"
    if not has_pin:
        return "NO_PIN"
    if shared[arx_card_number(card.mifare_csn, digits)] > 1:
        return "CARD_AMBIGUOUS"
    return ""


def _relevant_block(blocked: str, state: str, periods: list) -> str:
    """Ended permanent access is not held back by a missing card, but someone who had a booking was."""
    if state == "PAST" and not any(period.kind in ("BOOKING", "MANUAL") for period in periods):
        return ""
    return blocked


def _booking_role(booking, user_id, owners: set) -> str:
    if user_id in owners:
        return "Leder i foreningen" if booking.owner_organization_id and not booking.owner_user_id else "Bestiller"
    return "Ansvarlig" if user_id == booking.responsible_user_id else "Gjest"


def _booking_periods(since, cfg, mappings) -> tuple:
    before = timedelta(minutes=cfg.buffer_before_minutes)
    after = timedelta(minutes=cfg.buffer_after_minutes)
    bookings = list(
        JanHusBooking.objects.filter(status=JanHusBookingStatus.CONFIRMED, ends_at__gt=since - after).select_related(
            "area", "owner_organization"
        )
    )
    descendants = _area_descendants() if bookings else {}
    bookings = [b for b in bookings if _category_ids_for_area(b.area_id, mappings, descendants)]
    users_by_feide, leaders_by_org, members_by_org = _booking_memberships(bookings)

    user_periods: dict = {}
    for booking in bookings:
        owners = _booking_owner_holders(booking, leaders_by_org)
        organization = booking.owner_organization.name if booking.owner_organization_id else ""
        for user_id in owners | _policy_holders(booking, users_by_feide, members_by_org):
            detail = ", ".join(filter(None, [booking.area.name, organization, _booking_role(booking, user_id, owners)]))
            user_periods.setdefault(user_id, []).append(
                AccessPeriod("BOOKING", booking.starts_at - before, booking.ends_at + after, detail)
            )

    holder_periods: dict = {}
    by_id = {booking.id: booking for booking in bookings}
    for access in ExternalBookingAccess.objects.filter(booking_id__in=list(by_id)):
        booking = by_id[access.booking_id]
        holder_periods.setdefault(access.holder_id, []).append(
            AccessPeriod("EXTERNAL", booking.starts_at - before, booking.ends_at + after, booking.area.name)
        )
    return user_periods, holder_periods


def _permanent_periods(since) -> dict:
    periods: dict = {}
    given_at: dict = {}
    for user_id, given, changed_at in NfcPermanentAccessChange.objects.order_by("changed_at", "pk").values_list(
        "user_id", "given", "changed_at"
    ):
        if not given:
            given_at.pop(user_id, None)
        else:
            given_at.setdefault(user_id, changed_at)
    for user_id, graduation_year, until in NfcCardAssignment.objects.filter(
        permanent_access=True, revoked_at__isnull=True, user__isnull=False
    ).values_list("user_id", "user__graduation_year", "permanent_access_until"):
        periods.setdefault(user_id, []).append(
            AccessPeriod(
                "TEMPORARY" if until else "PERMANENT",
                given_at.get(user_id),
                permanent_access_ends(graduation_year, until),
            )
        )
    for user_id, changed_at, reason in NfcPermanentAccessChange.objects.filter(
        given=False, changed_at__gte=since
    ).values_list("user_id", "changed_at", "reason"):
        periods.setdefault(user_id, []).append(AccessPeriod("PERMANENT", None, changed_at, reason or "Fjernet"))
    return periods


def _manual_periods(since) -> dict:
    grants = [
        grant
        for grant in NfcManualAccess.objects.filter(ends_at__gt=since)
        .exclude(removed_at__lt=since)
        .select_related("organization")
        if grant.effective_end > grant.starts_at
    ]
    people = manual_access_people(grants)
    periods: dict = {}
    for grant in grants:
        organization = grant.organization.name if grant.organization_id else ""
        detail = ", ".join(filter(None, [organization, grant.reason]))
        for user_id in people[grant.pk]:
            periods.setdefault(user_id, []).append(AccessPeriod("MANUAL", grant.starts_at, grant.effective_end, detail))
    return periods


def _user_rows(periods_by_user: dict, note_only: set, now, shared: dict, digits: int) -> list:
    from apps.users.types import active_nfc_assignment, with_active_nfc_assignment

    users = with_active_nfc_assignment(
        get_user_model()
        .objects.filter(id__in=set(periods_by_user) | note_only)
        .select_related("nfc_note__updated_by")
        .prefetch_related("organizations")
    )
    rows = []
    for user in users:
        periods = periods_by_user.get(user.id, [])
        assignment = active_nfc_assignment(user)
        card = assignment.card if assignment else None
        if not user.is_active:
            blocked = "INACTIVE_USER"
        else:
            blocked = _card_blocked_reason(card, bool(assignment and assignment.has_pin), shared, digits)
        rows.append(
            AccessPerson(
                key=f"user-{user.id}",
                user=user,
                card_number=card.number_for_display if card else "",
                periods=periods,
                state=_state(periods, now) if periods else "NOTE_ONLY",
                blocked_reason=_relevant_block(blocked, _state(periods, now), periods) if periods else "",
            )
        )
    return rows


def _holder_rows(periods_by_holder: dict, now, shared: dict, digits: int) -> list:
    from .models import ExternalCardHolder

    rows = []
    for holder in ExternalCardHolder.objects.filter(id__in=list(periods_by_holder)).select_related("card"):
        periods = periods_by_holder[holder.id]
        rows.append(
            AccessPerson(
                key=f"holder-{holder.id}",
                holder_name=holder.name,
                card_number=holder.card.number_for_display,
                periods=periods,
                state=_state(periods, now),
                blocked_reason=_card_blocked_reason(holder.card, bool(holder.pin_code_encrypted), shared, digits),
            )
        )
    return rows


def _sort_key(person: AccessPerson) -> tuple:
    order = {"NOW": 0, "UPCOMING": 1, "PAST": 2, "NOTE_ONLY": 3}
    name = person.holder_name or (person.user.get_full_name() or person.user.username)
    return order[person.state], name.lower()


def door_access_overview(past_days: Optional[int] = None, now=None) -> AccessOverview:
    now = now or timezone.now()
    cfg = get_arx_settings()
    days = max(0, min(DEFAULT_PAST_DAYS if past_days is None else past_days, cfg.event_retention_days))
    since = now - timedelta(days=days)

    mappings = {
        mapping.area_id: mapping.arx_category_id.strip()
        for mapping in ArxAreaMapping.objects.filter(grants_access=True).exclude(arx_category_id="")
    }
    user_periods, holder_periods = _booking_periods(since, cfg, mappings)
    for periods in (_permanent_periods(since), _manual_periods(since)):
        for user_id, found in periods.items():
            user_periods.setdefault(user_id, []).extend(found)
    for periods in [*user_periods.values(), *holder_periods.values()]:
        periods.sort(key=lambda p: (p.starts_at is None, p.starts_at or now))

    note_only = set(NfcUserNote.objects.values_list("user_id", flat=True)) - set(user_periods)
    shared = shared_card_numbers(cfg)
    people = _user_rows(user_periods, note_only, now, shared, cfg.card_number_digits) + _holder_rows(
        holder_periods, now, shared, cfg.card_number_digits
    )
    return AccessOverview(
        people=sorted(people, key=_sort_key),
        past_days=days,
        max_past_days=cfg.event_retention_days,
        areas_connected=bool(mappings),
    )
