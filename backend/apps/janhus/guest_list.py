import json
from collections.abc import Iterable

from django.contrib.auth import get_user_model

MAX_GUEST_LIST_ENTRIES = 200


def _dedupe_preserve_order(values: Iterable[str]) -> list[str]:
    seen = set()
    result: list[str] = []

    for value in values:
        normalized = str(value).strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(normalized)

    return result


def normalize_guest_list_user_feide_ids(feide_ids: Iterable[str]) -> list[str]:
    cleaned = _dedupe_preserve_order(feide_ids)
    return cleaned[:MAX_GUEST_LIST_ENTRIES]


def parse_guest_list_user_feide_ids(raw_guest_list: str) -> list[str]:
    if not raw_guest_list:
        return []

    parsed_values: list[str]
    try:
        loaded = json.loads(raw_guest_list)
        if isinstance(loaded, list):
            parsed_values = [str(item) for item in loaded]
        else:
            parsed_values = []
    except (TypeError, ValueError, json.JSONDecodeError):
        parsed_values = [line for line in raw_guest_list.splitlines()]

    return normalize_guest_list_user_feide_ids(parsed_values)


def serialize_guest_list_user_feide_ids(feide_ids: Iterable[str]) -> str:
    return json.dumps(normalize_guest_list_user_feide_ids(feide_ids), ensure_ascii=False)


def find_missing_guest_feide_ids(feide_ids: Iterable[str]) -> list[str]:
    normalized_feide_ids = normalize_guest_list_user_feide_ids(feide_ids)
    if not normalized_feide_ids:
        return []

    user_model = get_user_model()
    existing_feide_ids = set(
        user_model.objects.filter(feide_userid__in=normalized_feide_ids).values_list("feide_userid", flat=True)
    )

    return [feide_id for feide_id in normalized_feide_ids if feide_id not in existing_feide_ids]


# Set by prefetch_guest_list_entries, read by JanHusBookingType.guest_list_entries.
GUEST_LIST_ENTRIES_ATTR = "_prefetched_guest_list_entries"


def _users_by_feide_id(feide_ids) -> dict:
    if not feide_ids:
        return {}

    user_model = get_user_model()
    users = user_model.objects.filter(feide_userid__in=list(feide_ids)).only(
        "feide_userid",
        "first_name",
        "last_name",
        "username",
    )

    user_by_feide_id: dict[str, object] = {}
    for user in users:
        if user.feide_userid and user.feide_userid not in user_by_feide_id:
            user_by_feide_id[user.feide_userid] = user
    return user_by_feide_id


def build_guest_list_entries(raw_guest_list: str) -> list[dict[str, str]]:
    feide_ids = parse_guest_list_user_feide_ids(raw_guest_list)
    if not feide_ids:
        return []
    return _guest_list_entries(feide_ids, _users_by_feide_id(feide_ids))


def prefetch_guest_list_entries(bookings) -> list:
    """
    The guest list entries of many bookings with one user query instead of one
    per booking. Returns the bookings as a list, each with its entries attached.
    """
    bookings = list(bookings)
    feide_ids_by_booking = {booking.pk: parse_guest_list_user_feide_ids(booking.guest_list) for booking in bookings}
    users = _users_by_feide_id({feide_id for ids in feide_ids_by_booking.values() for feide_id in ids})
    for booking in bookings:
        setattr(
            booking,
            GUEST_LIST_ENTRIES_ATTR,
            _guest_list_entries(feide_ids_by_booking[booking.pk], users),
        )
    return bookings


def _guest_list_entries(feide_ids, user_by_feide_id) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    for feide_id in feide_ids:
        user = user_by_feide_id.get(feide_id)
        if user is None:
            entries.append(
                {
                    "feide_userid": feide_id,
                    "display_name": feide_id,
                }
            )
            continue

        display_name = f"{user.first_name} {user.last_name}".strip() or user.username or feide_id
        entries.append(
            {
                "feide_userid": feide_id,
                "display_name": display_name,
            }
        )

    return entries
