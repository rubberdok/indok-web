"""
Pure business logic for the ARX integration. No HTTP to ARX happens here: the
JanHus runner does that. The backend decides *what* ARX should look like and
records *what the runner confirmed*.

Design: desired state is recomputed from the database on every poll and compared
by HMAC with the last confirmed state. There is no per-booking queue, so booking
confirmation, cancellation, expiry, card changes and PIN changes all converge
without signal handlers.
"""

import hashlib
import hmac
import json
import logging
import re
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, time as dt_time, timedelta, timezone as dt_timezone
from typing import Optional

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from django.db import IntegrityError, transaction
from django.db.models import Q
from django.utils import timezone

from apps.janhus.guest_list import parse_guest_list_user_feide_ids
from apps.janhus.models import (
    JanHusArea,
    JanHusBooking,
    JanHusBookingStatus,
    JanHusDoorAccessPolicy,
    JanHusOrganizationDoorAccess,
)
from apps.nfc.models import NfcAccessEvent, NfcCard, NfcCardAssignment, NfcManualAccess, permanent_access_ends
from apps.organizations.models import Membership
from apps.permissions.constants import HR_TYPE

from .models import (
    ArxAreaMapping,
    ArxEventCursor,
    ArxImportedEvent,
    ArxObservedCardFormat,
    ArxPersonSync,
    ArxSettings,
    ExternalBookingAccess,
    ExternalCardHolder,
    get_arx_settings,
)

logger = logging.getLogger(__name__)

PERSON_ID_PREFIX = "indok-"  # the only persons this integration ever creates or touches
EXTERNAL_ID_PREFIX = "indok-ext-"  # external card holders; website users are indok-<user pk>
PIN_RE = re.compile(r"^\d{4}$", flags=re.ASCII)
MAX_WORK_BATCH = 50
MAX_EVENT_BATCH = 500
UTC_FMT = "%Y-%m-%dT%H:%M:%SZ"
PERMANENT_WINDOW_DAYS = 28  # the runner refuses any window over ARX_MAX_WINDOW_DAYS (31)
CSN_LIMIT = 2**32  # indok-web's 10-digit CSN = the card's first 4 UID bytes as an unsigned 32-bit number
NXP_MANUFACTURER_BYTE = 0x04  # byte 0 of every NXP 7-byte UID = the lowest byte of its CSN


def card_format_for(card, cfg: ArxSettings, observed: Optional[str] = None) -> str:
    """
    Which ARX format a card belongs to. What ARX reported at the door wins. Otherwise
    the number printed on the card tells: 15-17 digits after "UID" on newer (DESFire)
    cards, 10 digits after "mS" or "M" on older (MIFARE Classic) ones. A card registered
    with only its door number falls back to a guess: a DESFire CSN always has 0x04 as its
    lowest byte, an older card only by chance (1 in 256); the door event then corrects it.
    """
    if observed in (cfg.card_format_classic, cfg.card_format_desfire):
        return observed
    if card.card_number:
        return cfg.card_format_desfire if len(card.card_number) > 10 else cfg.card_format_classic
    if int(card.mifare_csn) & 0xFF == NXP_MANUFACTURER_BYTE:
        return cfg.card_format_desfire
    return cfg.card_format_classic


def arx_card_number(mifare_csn: str, digits: int) -> str:
    """
    The number ARX sees for an indok-web card. The JanHus readers report the
    32-bit CSN cut to its last `digits` decimal digits: CSN 3434850820 shows
    up in ARX as 434850820. digits=0 keeps the whole number.
    """
    n = int(mifare_csn)
    return str(n % 10**digits if digits else n)


def csn_candidates(arx_number: str, digits: int) -> list:
    """Every indok-web CSN that ARX would show as `arx_number` (at most five with 9 digits)."""
    value = re.sub(r"\D", "", arx_number or "")
    if not value or len(value) > 10 or (digits and len(value) > digits):
        return []
    n = int(value)
    step = 10**digits if digits else CSN_LIMIT
    return [f"{c:010d}" for c in range(n, CSN_LIMIT, step)]


def external_id_for(user) -> str:
    return f"{PERSON_ID_PREFIX}{user.pk}"


def external_id_for_holder(holder) -> str:
    return f"{EXTERNAL_ID_PREFIX}{holder.pk}"


@dataclass(frozen=True)
class DesiredState:
    external_id: str
    first_name: str
    last_name: str
    pin: str
    card_number: str
    card_format: str
    windows: tuple  # ((category_id, start_iso_utc, end_iso_utc), ...) sorted
    blocked_reason: str = ""  # "", "no_card", "no_pin"
    take_card_from: str = ""  # ARX person an admin approved taking this card from
    user_id: Optional[int] = None  # bookkeeping only, not part of the digest
    holder_id: Optional[int] = None  # set instead of user_id for an external card holder

    def digest(self) -> str:
        if not settings.ARX_STATE_HMAC_KEY:
            raise ImproperlyConfigured("ARX_STATE_HMAC_KEY is not set")
        key = settings.ARX_STATE_HMAC_KEY.encode()
        payload = json.dumps(
            [
                self.first_name,
                self.last_name,
                self.pin,
                self.card_number,
                self.card_format,
                self.windows,
                self.take_card_from,
            ],
            separators=(",", ":"),
            ensure_ascii=False,
        ).encode()
        return hmac.new(key, payload, hashlib.sha256).hexdigest()


def _cleared(
    external_id: str, user_id: Optional[int] = None, blocked: str = "", holder_id: Optional[int] = None
) -> DesiredState:
    """
    No access. ARX keeps only the bare id: no name, PIN, categories, and (via the
    runner) no cards. This is also the GDPR end state for people whose access ended.
    """
    return DesiredState(external_id, "", "", "", "", "", (), blocked, user_id=user_id, holder_id=holder_id)


# ------------------------------------------------------------------ desired state


RESPONSIBLE_POLICIES = (JanHusDoorAccessPolicy.BOOKER_AND_RESPONSIBLE, JanHusDoorAccessPolicy.ALL_PARTICIPANTS)


def _booking_holders(booking: JanHusBooking, users_by_feide: dict, leaders_by_org: dict, members_by_org: dict) -> set:
    """
    Who may open the door for this booking. JanHus admins set it on the booking.
    - personal booking: owner_user
    - organisation booking: the organisation's HR members (the default), or only the
      booker when organization_door_access says so. Without HR members nobody gets the
      door as booker (decided 2026-10-30): the admin page warns, and an admin picks
      "booker only" or adds an external card. The booker is the website user who booked
      (booker_user), never the admin who approved the request (created_by_user).
    - external booking: no booker (external bookers use an external card, design §3c)
    - the responsible person, once linked to a website user, for the policies
      BOOKER_AND_RESPONSIBLE and ALL_PARTICIPANTS
    - ALL_PARTICIPANTS: the guest list, and on an organisation booking every member of
      the organisation too: they count as its guest list
    Inactive users are left out later, in compute_desired_states.
    """
    return _booking_owner_holders(booking, leaders_by_org) | _policy_holders(booking, users_by_feide, members_by_org)


def _booking_owner_holders(booking: JanHusBooking, leaders_by_org: dict) -> set:
    if booking.owner_user_id:
        return {booking.owner_user_id}
    if not booking.owner_organization_id:
        return set()
    if booking.organization_door_access == JanHusOrganizationDoorAccess.BOOKER_ONLY:
        return {booking.booker_user_id} if booking.booker_user_id else set()
    return set(leaders_by_org.get(booking.owner_organization_id, ()))


def _policy_holders(booking: JanHusBooking, users_by_feide: dict, members_by_org: dict) -> set:
    holders = set()
    if booking.responsible_user_id and booking.door_access_policy in RESPONSIBLE_POLICIES:
        holders.add(booking.responsible_user_id)

    if booking.door_access_policy != JanHusDoorAccessPolicy.ALL_PARTICIPANTS:
        return holders
    for feide_id in parse_guest_list_user_feide_ids(booking.guest_list):
        user_id = users_by_feide.get(feide_id)
        if user_id:
            holders.add(user_id)
    if booking.owner_organization_id:
        holders.update(members_by_org.get(booking.owner_organization_id, ()))
    return holders


def _start_of_week(now):
    local = timezone.localtime(now)
    monday = local.date() - timedelta(days=local.weekday())
    return timezone.make_aware(datetime.combine(monday, dt_time.min))


def permanent_window(now) -> tuple:
    """
    (start, end) in UTC for permanent access: Monday 00:00 Oslo time of the current
    week plus PERMANENT_WINDOW_DAYS. The window moves once a week, so each such
    person is sent again weekly, and has at least three weeks left if the sync stops.
    """
    start = _start_of_week(now)
    end = start + timedelta(days=PERMANENT_WINDOW_DAYS)
    return (
        start.astimezone(dt_timezone.utc).strftime(UTC_FMT),
        end.astimezone(dt_timezone.utc).strftime(UTC_FMT),
    )


def _area_descendants() -> dict:
    """{area id: ids of every area below it}, from one query (JanHusArea._descendant_ids asks once per area)."""
    children: dict = {}
    for area_id, parent_id in JanHusArea.objects.values_list("id", "parent_id"):
        children.setdefault(area_id, set())
        children.setdefault(parent_id, set()).add(area_id)

    def below(area_id, seen):
        for child in children.get(area_id, ()):
            if child not in seen:
                seen.add(child)
                below(child, seen)
        return seen

    return {area_id: below(area_id, set()) for area_id in children if area_id is not None}


def _category_ids_for_area(area_id, mappings: dict, descendants: dict) -> set:
    area_ids = {area_id} | descendants.get(area_id, set())  # booking a parent area covers its children
    return {m for a in area_ids if (m := mappings.get(a))}


def _booking_owner_ids(bookings):
    guest_ids = set()
    org_ids = set()
    guest_org_ids = set()
    for booking in bookings:
        if booking.owner_organization_id:
            org_ids.add(booking.owner_organization_id)
        if booking.door_access_policy == JanHusDoorAccessPolicy.ALL_PARTICIPANTS:
            guest_ids.update(parse_guest_list_user_feide_ids(booking.guest_list))
            if booking.owner_organization_id:
                guest_org_ids.add(booking.owner_organization_id)
    return guest_ids, org_ids, guest_org_ids


def _organization_people(org_ids, guest_org_ids):
    leaders_by_org: dict = {}
    members_by_org: dict = {}
    if org_ids:
        memberships = (
            Membership.objects.filter(organization_id__in=org_ids, user__is_active=True)
            .filter(Q(group__group_type=HR_TYPE) | Q(organization_id__in=guest_org_ids))
            .values_list("organization_id", "user_id", "group__group_type")
        )
        for org_id, user_id, group_type in memberships:
            if group_type == HR_TYPE:
                leaders_by_org.setdefault(org_id, set()).add(user_id)
            if org_id in guest_org_ids:
                members_by_org.setdefault(org_id, set()).add(user_id)
    return leaders_by_org, members_by_org


def _booking_memberships(bookings):
    guest_ids, org_ids, guest_org_ids = _booking_owner_ids(bookings)
    user_model = get_user_model()
    users_by_feide = (
        dict(user_model.objects.filter(feide_userid__in=guest_ids).values_list("feide_userid", "id"))
        if guest_ids
        else {}
    )
    leaders_by_org, members_by_org = _organization_people(org_ids, guest_org_ids)
    return users_by_feide, leaders_by_org, members_by_org


def _booking_window(booking, before, after) -> tuple:
    return (
        (booking.starts_at - before).astimezone(dt_timezone.utc).strftime(UTC_FMT),
        (booking.ends_at + after).astimezone(dt_timezone.utc).strftime(UTC_FMT),
    )


def _booking_access_windows(
    bookings, mappings, descendants, before, after, users_by_feide, leaders_by_org, members_by_org
):
    windows: dict = {}
    for booking in bookings:
        categories = _category_ids_for_area(booking.area_id, mappings, descendants)
        if not categories:
            continue
        start, end = _booking_window(booking, before, after)
        for user_id in _booking_holders(booking, users_by_feide, leaders_by_org, members_by_org):
            windows.setdefault(user_id, set()).update((category, start, end) for category in categories)
    return windows


def _permanent_access_windows(now, mappings) -> dict:
    windows: dict = {}
    if not mappings:
        return windows
    start, end = permanent_window(now)
    now_utc = now.astimezone(dt_timezone.utc).strftime(UTC_FMT)
    categories = set(mappings.values())
    assignments = NfcCardAssignment.objects.filter(
        permanent_access=True, revoked_at__isnull=True, user__is_active=True
    ).values_list("user_id", "user__graduation_year", "permanent_access_until")
    for user_id, graduation_year, set_end in assignments:
        access_end = permanent_access_ends(graduation_year, set_end)
        until = end if access_end is None else min(end, access_end.astimezone(dt_timezone.utc).strftime(UTC_FMT))
        if until > now_utc:
            windows.setdefault(user_id, set()).update((category, start, until) for category in categories)
    return windows


def manual_access_people(grants) -> dict:
    """{grant pk: ids of the active users it covers}, from at most two queries however many grants there are."""
    org_ids = {grant.organization_id for grant in grants if grant.organization_id}
    member_org_ids = {
        grant.organization_id
        for grant in grants
        if grant.organization_id and grant.organization_people == NfcManualAccess.OrganizationPeople.MEMBERS
    }
    leaders_by_org, members_by_org = _organization_people(org_ids, member_org_ids)
    active_users = set(
        get_user_model()
        .objects.filter(id__in={grant.user_id for grant in grants if grant.user_id}, is_active=True)
        .values_list("id", flat=True)
    )
    people = {}
    for grant in grants:
        if grant.user_id:
            people[grant.pk] = {grant.user_id} & active_users
        elif grant.organization_people == NfcManualAccess.OrganizationPeople.MEMBERS:
            people[grant.pk] = set(members_by_org.get(grant.organization_id, ()))
        else:
            people[grant.pk] = set(leaders_by_org.get(grant.organization_id, ()))
    return people


def _manual_access_windows(now, horizon_days, mappings) -> dict:
    """
    A long period goes to ARX a piece at a time, like permanent access, since the runner refuses long windows.
    The pieces follow the week, so ARX is updated once a week and not on every poll.
    """
    windows: dict = {}
    if not mappings:
        return windows
    grants = list(
        NfcManualAccess.objects.filter(
            removed_at__isnull=True, ends_at__gt=now, starts_at__lt=now + timedelta(days=horizon_days)
        )
    )
    people = manual_access_people(grants)
    categories = set(mappings.values())
    week_start = _start_of_week(now)
    for grant in grants:
        start = max(grant.starts_at, week_start)
        end = min(grant.ends_at, start + timedelta(days=PERMANENT_WINDOW_DAYS))
        window = (
            start.astimezone(dt_timezone.utc).strftime(UTC_FMT),
            end.astimezone(dt_timezone.utc).strftime(UTC_FMT),
        )
        for user_id in people[grant.pk]:
            windows.setdefault(user_id, set()).update((category, *window) for category in categories)
    return windows


def _external_booking_windows(bookings, mappings, descendants, before, after) -> dict:
    holder_windows: dict = {}
    bookings_by_id = {booking.id: booking for booking in bookings}
    if not bookings_by_id or not mappings:
        return holder_windows
    for access in ExternalBookingAccess.objects.filter(booking_id__in=list(bookings_by_id)):
        booking = bookings_by_id[access.booking_id]
        categories = _category_ids_for_area(booking.area_id, mappings, descendants)
        if not categories:
            continue
        start, end = _booking_window(booking, before, after)
        holder_windows.setdefault(access.holder_id, set()).update((category, start, end) for category in categories)
    return holder_windows


def _desired_person_state(
    external_id,
    first_name,
    last_name,
    card,
    pin,
    wanted,
    rows,
    cfg,
    observed,
    shared_numbers,
    user_id=None,
    holder_id=None,
):
    blocked, number = "", ""
    if wanted and (card is None or not card.mifare_csn.isdigit()):
        blocked = "no_card"
    elif wanted and not PIN_RE.match(pin or ""):
        blocked = "no_pin"
    elif wanted:
        number = arx_card_number(card.mifare_csn, cfg.card_number_digits)
        if shared_numbers[number] > 1:
            blocked = "card_ambiguous"
    if blocked or not wanted:
        return _cleared(external_id, user_id, blocked, holder_id)
    _, _, take_from, take_card_id = rows.get(external_id, (None, None, "", None))
    return DesiredState(
        external_id,
        first_name,
        last_name,
        pin,
        number,
        card_format_for(card, cfg, observed.get(card.pk)).strip(),
        wanted,
        "",
        take_card_from=take_from if take_from and take_card_id == card.pk else "",
        user_id=user_id,
        holder_id=holder_id,
    )


def _desired_user_states(user_ids, users, assignments, windows, rows, cfg, observed, shared_numbers) -> dict:
    states = {}
    for user_id in user_ids:
        user = users.get(user_id)
        if user is None:
            continue
        assignment = assignments.get(user_id)
        external_id = external_id_for(user)
        states[external_id] = _desired_person_state(
            external_id,
            user.first_name,
            user.last_name,
            assignment.card if assignment and assignment.card.is_enabled else None,
            assignment.pin_code if assignment else "",
            tuple(sorted(windows.get(user_id, ()))) if user.is_active else (),
            rows,
            cfg,
            observed,
            shared_numbers,
            user_id=user_id,
        )
    return states


def _desired_holder_states(holder_ids, holders, holder_windows, rows, cfg, observed, shared_numbers) -> dict:
    states = {}
    for holder_id in holder_ids:
        holder = holders.get(holder_id)
        if holder is None:
            continue
        external_id = external_id_for_holder(holder)
        states[external_id] = _desired_person_state(
            external_id,
            holder.name,
            "",
            holder.card if holder.card.is_enabled else None,
            holder.pin_code,
            tuple(sorted(holder_windows.get(holder_id, ()))),
            rows,
            cfg,
            observed,
            shared_numbers,
            holder_id=holder_id,
        )
    return states


def shared_card_numbers(cfg) -> Counter:
    """How many enabled cards in use give each ARX number. More than one means the door cannot tell them apart."""
    in_use = list(
        NfcCardAssignment.objects.filter(revoked_at__isnull=True, card__is_enabled=True).values_list(
            "card__mifare_csn", flat=True
        )
    ) + list(ExternalCardHolder.objects.filter(card__is_enabled=True).values_list("card__mifare_csn", flat=True))
    return Counter(arx_card_number(csn, cfg.card_number_digits) for csn in in_use if csn.isdigit())


def _states_for_known_people(user_ids, holder_ids, windows, holder_windows, rows, cfg) -> dict:
    users = {user.id: user for user in get_user_model().objects.filter(id__in=user_ids)}
    assignments: dict = {}
    for assignment in NfcCardAssignment.objects.filter(user_id__in=user_ids, revoked_at__isnull=True).select_related(
        "card"
    ):
        assignments[assignment.user_id] = assignment
    holders = {
        holder.id: holder for holder in ExternalCardHolder.objects.filter(id__in=holder_ids).select_related("card")
    }
    card_ids = [assignment.card_id for assignment in assignments.values()] + [
        holder.card_id for holder in holders.values()
    ]
    observed = dict(ArxObservedCardFormat.objects.filter(card_id__in=card_ids).values_list("card_id", "format_name"))
    shared_numbers = shared_card_numbers(cfg)

    states = _desired_user_states(user_ids, users, assignments, windows, rows, cfg, observed, shared_numbers)
    states.update(_desired_holder_states(holder_ids, holders, holder_windows, rows, cfg, observed, shared_numbers))
    return states


def compute_desired_states(now=None, cfg: Optional[ArxSettings] = None) -> dict:
    """{external_id: DesiredState} for every person that has, or previously had, ARX state."""
    now = now or timezone.now()
    cfg = cfg or get_arx_settings()
    before = timedelta(minutes=cfg.buffer_before_minutes)
    after = timedelta(minutes=cfg.buffer_after_minutes)

    mappings = {
        m.area_id: m.arx_category_id.strip()
        for m in ArxAreaMapping.objects.filter(grants_access=True).exclude(arx_category_id="")
    }

    bookings = list(
        JanHusBooking.objects.filter(
            status=JanHusBookingStatus.CONFIRMED,
            ends_at__gt=now - after,
            starts_at__lt=now + timedelta(days=cfg.horizon_days) + before,
        )
    )
    descendants = _area_descendants() if bookings else {}

    users_by_feide, leaders_by_org, members_by_org = _booking_memberships(bookings)
    windows = _booking_access_windows(
        bookings, mappings, descendants, before, after, users_by_feide, leaders_by_org, members_by_org
    )
    for user_id, permanent_windows in _permanent_access_windows(now, mappings).items():
        windows.setdefault(user_id, set()).update(permanent_windows)
    for user_id, manual_windows in _manual_access_windows(now, cfg.horizon_days, mappings).items():
        windows.setdefault(user_id, set()).update(manual_windows)
    holder_windows = _external_booking_windows(bookings, mappings, descendants, before, after)

    rows = {
        ext: (uid, hid, take_from, take_card_id)
        for ext, uid, hid, take_from, take_card_id in ArxPersonSync.objects.values_list(
            "external_id", "user_id", "external_holder_id", "takeover_from_arx_person_id", "takeover_card_id"
        )
    }
    # Neither a user nor a holder left: it was deleted. Clear ARX, then the row is removed.
    states = {ext: _cleared(ext) for ext, (uid, hid, _, _) in rows.items() if uid is None and hid is None}
    user_ids = set(windows) | {uid for uid, _, _, _ in rows.values() if uid is not None}
    holder_ids = set(holder_windows) | {hid for _, hid, _, _ in rows.values() if hid is not None}
    if not user_ids and not holder_ids:
        return states

    states.update(_states_for_known_people(user_ids, holder_ids, windows, holder_windows, rows, cfg))
    return states


# ----------------------------------------------------------------- runner: work


def _row_for_pending_state(external_id, state, digest, rows):
    row = rows.get(external_id)
    if row is not None or (state.user_id is None and state.holder_id is None):
        return row
    owner = {"user_id": state.user_id, "external_holder_id": state.holder_id}
    if not state.windows:
        if state.blocked_reason:
            ArxPersonSync.objects.create(
                **owner,
                external_id=external_id,
                status=ArxPersonSync.Status.BLOCKED,
                last_error=state.blocked_reason,
                synced_hash=digest,
            )
        return None
    return ArxPersonSync.objects.create(**owner, external_id=external_id)


def _pending_work_item(external_id, state, digest) -> dict:
    return {
        "external_id": external_id,
        "first_name": state.first_name,
        "last_name": state.last_name,
        "pin": state.pin,
        "card_number": state.card_number,
        "card_format": state.card_format,
        "windows": [{"category_id": category, "start": start, "end": end} for category, start, end in state.windows],
        "state_hash": digest,
        "blocked": state.blocked_reason,
        "take_card_from": state.take_card_from,
    }


def _needs_push(row, digest) -> bool:
    if row.synced_hash == digest:
        if row.user_id is None and row.external_holder_id is None:
            row.delete()  # deleted after ARX was already cleared: nothing left to do
        return False
    # A card conflict waits for an admin's approval or retry.
    return not (row.conflict_hash and hmac.compare_digest(row.conflict_hash, digest))


def pending_work(limit: int = MAX_WORK_BATCH, now=None) -> list:
    """
    Items the runner must push. Contains PINs: the caller must return it only
    over TLS to an authenticated runner and must never log it.
    """
    cfg = get_arx_settings()
    if not cfg.sync_enabled:
        return []
    now = now or timezone.now()
    states = compute_desired_states(now, cfg)
    rows = {r.external_id: r for r in ArxPersonSync.objects.all()}
    work, issued = [], []
    for ext, state in states.items():
        digest = state.digest()
        row = _row_for_pending_state(ext, state, digest, rows)
        if row is None or not _needs_push(row, digest):
            continue
        work.append(_pending_work_item(ext, state, digest))
        row.issued_hash = digest
        issued.append(row)
        if len(work) >= limit:
            break
    if issued:
        ArxPersonSync.objects.bulk_update(issued, ["issued_hash"])
    return work


def _clean_arx_text(value, limit: int) -> str:
    """ARX ids and names shown in admin: printable characters only."""
    return "".join(ch for ch in str(value or "") if ch.isprintable()).strip()[:limit]


def _record_result(result, now) -> bool:
    external_id = str(result.get("external_id", ""))
    if not external_id.startswith(PERSON_ID_PREFIX):
        return False
    row = ArxPersonSync.objects.select_for_update().filter(external_id=external_id).first()
    reported = str(result.get("state_hash", ""))
    if row is None or not row.issued_hash or not hmac.compare_digest(reported, row.issued_hash):
        return False

    row.attempts += 1
    row.last_attempt_at = now
    if result.get("ok") is True:
        if row.user_id is None and row.external_holder_id is None:
            row.delete()
            return True
        blocked = re.sub(r"[^a-z_]", "", str(result.get("blocked", "")))[:20]
        row.synced_hash = row.issued_hash
        row.status = ArxPersonSync.Status.BLOCKED if blocked else ArxPersonSync.Status.SYNCED
        row.last_error = blocked
        row.synced_at = now
        row.conflict_arx_person_id = row.conflict_arx_person_name = row.conflict_hash = ""
    else:
        row.status = ArxPersonSync.Status.FAILED
        row.last_error = re.sub(r"[^A-Za-z_.]", "", str(result.get("error", "unknown")))[:60]
        holder = _clean_arx_text(result.get("arx_person_id"), 64)
        if row.last_error == "card_conflict" and holder and not holder.startswith(PERSON_ID_PREFIX):
            row.conflict_arx_person_id = holder
            row.conflict_arx_person_name = _clean_arx_text(result.get("arx_person_name"), 200)
            row.conflict_hash = row.issued_hash
    row.issued_hash = ""
    row.save()
    return True


@transaction.atomic
def record_results(results: list) -> int:
    """
    results: [{external_id, state_hash, ok, error, blocked, arx_person_id, arx_person_name}].
    Returns rows updated. A result counts only for the exact hash this backend
    issued, so a forged or stale "ok" cannot mark a revocation as done.
    """
    now = timezone.now()
    return sum(_record_result(result, now) for result in results[:MAX_WORK_BATCH])


# ------------------------------------------------------------------ runner: events


def get_cursor() -> ArxEventCursor:
    cursor, _ = ArxEventCursor.objects.get_or_create(pk=ArxEventCursor.SINGLETON_PK)
    return cursor


def _event_type(name: str) -> Optional[str]:
    if name.startswith("controller.access.card.valid."):
        return NfcAccessEvent.EventType.ACCESS_GRANTED
    if name.startswith("controller.access.card.invalid."):
        return NfcAccessEvent.EventType.ACCESS_DENIED
    if name == "controller.access.card.duress":
        return NfcAccessEvent.EventType.ACCESS_GRANTED  # let in, under duress: raw name kept
    if name == "controller.door.opened":
        return NfcAccessEvent.EventType.DOOR_OPENED
    if name == "controller.door.requestToExit":
        return NfcAccessEvent.EventType.EXIT_BUTTON
    if name == "controller.door.forcedOpen":
        return NfcAccessEvent.EventType.FORCED_OPEN
    return None


ALTERNATE_CARD_DIGITS = (0, 9)  # the whole number, or the 9 digits the "External" format kept


def _check_card_number_digits(unmatched_numbers: list, matched_cards: int, cfg: ArxSettings) -> None:
    """
    A wrong card_number_digits does not fail anywhere: events just match no card.
    Cards of people added by hand in ARX also match none, so "no match" alone means
    nothing. What does: numbers that match no card now but would with another value.
    The warning holds counts only and is cleared once events match normally.
    """
    hits = {}
    for alt in ALTERNATE_CARD_DIGITS:
        if alt == cfg.card_number_digits:
            continue
        reported_by_candidate = {c: n for n in unmatched_numbers for c in csn_candidates(n, alt)}
        if reported_by_candidate:
            known = NfcCard.objects.filter(mifare_csn__in=list(reported_by_candidate)).values_list(
                "mifare_csn", flat=True
            )
            hits[alt] = len({reported_by_candidate[c] for c in known})
    alt, count = max(hits.items(), key=lambda item: item[1], default=(None, 0))
    settings_row = ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK)
    if count:
        message = (
            f"{count} door event(s) matched no card with card_number_digits={cfg.card_number_digits}, "
            f"but would with {alt}. Check the setting (checklist §5)."
        )
        logger.warning("ARX card number setting looks wrong; the details are in the ARX settings warning")
        settings_row.update(card_digits_warning=message[:200], card_digits_warning_at=timezone.now())
    elif matched_cards and cfg.card_digits_warning:
        settings_row.update(card_digits_warning="", card_digits_warning_at=None)


def _store_imported_event(event_data, event_id, event_type, occurred_at, cfg, known_formats) -> tuple:
    candidates = csn_candidates(str(event_data.get("card_number", "")), cfg.card_number_digits)
    matches = list(NfcCard.objects.filter(mifare_csn__in=candidates)[:2]) if candidates else []
    # More than one match is ambiguous; never attach the event to either card.
    card = matches[0] if len(matches) == 1 else None
    reported = re.sub(r"\D", "", str(event_data.get("card_number", "")))
    if card:
        csn = card.mifare_csn
    elif not matches and 0 < len(reported) <= 10:
        csn = reported.zfill(10)
    else:
        csn = ""

    reported_format = str(event_data.get("card_format", ""))[:100]
    unmatched_number = None
    if card and reported_format in known_formats:
        ArxObservedCardFormat.objects.update_or_create(card=card, defaults={"format_name": reported_format})
    elif not matches and reported and reported_format in known_formats:
        unmatched_number = reported

    assignment = None
    if card:
        assignment = (
            NfcCardAssignment.objects.filter(card=card, assigned_at__lte=occurred_at)
            .exclude(revoked_at__lt=occurred_at)
            .select_related("user")
            .order_by("-assigned_at")
            .first()
        )
    try:
        with transaction.atomic():
            imported_event = NfcAccessEvent.objects.create(
                event_type=event_type,
                source=NfcAccessEvent.Source.NFC_READER,
                door_identifier=(str(event_data.get("dac_name", "")) or str(event_data.get("dac_external_id", "")))[
                    :120
                ],
                mifare_csn_reported=csn,
                card=card,
                card_assignment=assignment,
                resolved_user=assignment.user if assignment else None,
                person_name=str(event_data.get("person_name", ""))[:200],
                occurred_at=occurred_at,
                raw_payload={
                    "arx_event_id": event_id,
                    "name": str(event_data.get("name", ""))[:100],
                    "card_format": str(event_data.get("card_format", ""))[:100],
                },
            )
            ArxImportedEvent.objects.create(arx_event_id=event_id, event=imported_event)
    except IntegrityError:  # a concurrent request imported this event first
        return False, bool(card), unmatched_number
    return True, bool(card), unmatched_number


def ingest_events(events: list, new_cursor_ms: int) -> dict:
    """events: [{id, name, timestamp_ms, dac_external_id, dac_name, card_number, card_format}]"""
    events = events[:MAX_EVENT_BATCH]
    ids = [str(e.get("id", ""))[:64] for e in events]
    seen = set(ArxImportedEvent.objects.filter(arx_event_id__in=ids).values_list("arx_event_id", flat=True))
    created = skipped = matched_cards = 0
    unmatched_numbers: list = []
    cfg = get_arx_settings()
    known_formats = {cfg.card_format_classic, cfg.card_format_desfire}
    for e, event_id in zip(events, ids):
        event_type = _event_type(str(e.get("name", "")))
        try:
            ts = int(e["timestamp_ms"])
        except (KeyError, TypeError, ValueError):
            skipped += 1
            continue
        if not event_id or event_id in seen or event_type is None or ts <= 0:
            skipped += 1
            continue
        occurred_at = datetime.fromtimestamp(ts / 1000, tz=dt_timezone.utc)
        was_created, matched, unmatched_number = _store_imported_event(
            e, event_id, event_type, occurred_at, cfg, known_formats
        )
        matched_cards += matched
        if unmatched_number:
            unmatched_numbers.append(unmatched_number)
        if not was_created:
            skipped += 1
            continue
        seen.add(event_id)
        created += 1

    _check_card_number_digits(unmatched_numbers, matched_cards, cfg)

    cursor = get_cursor()
    ceiling = int((timezone.now() + timedelta(minutes=2)).timestamp() * 1000)
    candidate = min(int(new_cursor_ms), ceiling)
    if candidate > cursor.last_timestamp_ms:
        cursor.last_timestamp_ms = candidate
        cursor.save(update_fields=["last_timestamp_ms"])
    # Retention is enforced here, every 30 minutes, so scheduled AWS task is not needed.
    pruned = prune_events()
    return {"created": created, "skipped": skipped, "pruned": pruned}


def prune_events(now=None) -> int:
    """Delete ARX-imported door events older than the configured retention."""
    now = now or timezone.now()
    cutoff = now - timedelta(days=get_arx_settings().event_retention_days)
    qs = NfcAccessEvent.objects.filter(arx_import__isnull=False, occurred_at__lt=cutoff)
    count = qs.count()
    qs.delete()
    NfcManualAccess.objects.filter(Q(ends_at__lt=cutoff) | Q(removed_at__lt=cutoff)).delete()
    return count
