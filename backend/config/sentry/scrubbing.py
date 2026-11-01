"""
Keeps door PINs, card numbers and the JanHus runner's traffic out of Sentry.

Production Sentry captures frame locals and request bodies, and
config.sentry.middleware sends every GraphQL resolver error, including the
validation error for a mistyped PIN. Two independent layers, both wired in
config/settings/production.py:

1. build_event_scrubber(): Sentry's own EventScrubber with the PIN and card keys
   added to its denylist, applied recursively (request bodies, GraphQL
   variables, frame locals, extra, breadcrumbs).
2. scrub_event(), as before_send and before_send_transaction: removes what a key
   list cannot catch, i.e. the same values held under other names (a setter's
   `value`, a whole request body as text). It also filters the same keys itself,
   so it is enough on its own if Sentry's scrubber could not be configured.

This module must not import sentry_sdk at import time: the SDK is only in the
production requirements, and the tests import scrub_event.
"""

import json
import logging
import re

# Lower case: Sentry compares keys case-insensitively.
SENSITIVE_KEYS = (
    "pin",
    "pin_code",
    "pincode",
    "pin_code_encrypted",
    "nfc_pin_code",
    "nfcpincode",
    "new_nfc_pin_code",
    "card_number",
    "cardnumber",
    "nfc_card_number",
    "nfccardnumber",
    "mifare_csn",
    "mifarecsn",
    "nfc_mifare_csn",
    "nfcmifarecsn",
    "mifare_csn_input",
    "normalized_mifare_csn",
    "mifare_csn_reported",
    "person_name",
    "nfc_pin_encryption_key",
    "arx_state_hmac_key",
)

# Locals in these modules can hold a PIN or card number under any name.
SENSITIVE_MODULES = ("apps.nfc", "apps.users", "apps.arx")
RUNNER_PATH = "/arx-runner/"
FILTERED = "[Filtered]"  # what Sentry's own scrubber puts in place of a value
# A GraphQL body that mentions any of these may carry a PIN or card number.
SENSITIVE_GRAPHQL = re.compile(r"pin_?code|nfc|card_?number|mifare|csn", re.IGNORECASE)
# SQL that touches these tables can carry card numbers in its parameters.
SENSITIVE_SQL = re.compile(r"\b(nfc|arx)_", re.IGNORECASE)


def build_event_scrubber():
    """
    Sentry's EventScrubber with our keys added. If the installed SDK does not take
    these arguments, Sentry keeps its default scrubber and scrub_event still runs;
    the error is logged instead of stopping the site from starting.

    send_default_pii is left at its default (False) here on purpose, although
    production sets it to True: the scrubber then also filters Sentry's PII keys
    (email, IP address and the like) in request data, extra and breadcrumbs.
    Filtering more than the setting implies is the intended direction.
    """
    try:
        from sentry_sdk.scrubber import DEFAULT_DENYLIST, EventScrubber

        return EventScrubber(denylist=list(DEFAULT_DENYLIST) + list(SENSITIVE_KEYS), recursive=True)
    except (ImportError, TypeError):
        logging.getLogger(__name__).error(
            "Sentry EventScrubber could not be configured; scrub_event alone filters PINs and card numbers"
        )
        return None


def _in_sensitive_module(module) -> bool:
    module = str(module or "")
    return any(module == m or module.startswith(m + ".") for m in SENSITIVE_MODULES)


def _frames(event: dict):
    for container in ("exception", "threads"):
        for value in (event.get(container) or {}).get("values") or []:
            yield from (value.get("stacktrace") or {}).get("frames") or []


def _mentions(pattern, value) -> bool:
    if value is None:
        return False
    text = value if isinstance(value, str) else json.dumps(value, default=str)
    return bool(pattern.search(text))


def _filter_sensitive_keys(value) -> None:
    """Replaces the value of every SENSITIVE_KEYS key, at any depth, as Sentry's scrubber does."""
    if isinstance(value, dict):
        for key in value:
            if str(key).lower() in SENSITIVE_KEYS:
                value[key] = FILTERED
            else:
                _filter_sensitive_keys(value[key])
    elif isinstance(value, list):
        for item in value:
            _filter_sensitive_keys(item)


def _is_sensitive_request(request: dict) -> bool:
    url = str(request.get("url", ""))
    return RUNNER_PATH in url or ("graphql" in url.lower() and _mentions(SENSITIVE_GRAPHQL, request.get("data")))


def _scrub_sensitive_request(event: dict, request: dict) -> None:
    for key in ("data", "query_string", "cookies", "env", "headers"):
        request.pop(key, None)
    event.pop("extra", None)


def _scrub_frames(event: dict, sensitive_request: bool) -> None:
    for frame in _frames(event):
        if sensitive_request or _in_sensitive_module(frame.get("module")):
            frame.pop("vars", None)


def _scrub_query_breadcrumbs(event: dict) -> None:
    for crumb in (event.get("breadcrumbs") or {}).get("values") or []:
        if crumb.get("category") == "query" and _mentions(SENSITIVE_SQL, crumb.get("message")):
            crumb.pop("data", None)


def _scrub_sensitive_spans(event: dict) -> None:
    for span in event.get("spans") or []:
        if _mentions(SENSITIVE_SQL, span.get("description")):
            span.pop("data", None)


# Sentry's before_send callback signature includes `hint`, even when this scrubber does not inspect it.
def scrub_event(event: dict, hint=None) -> dict:  # NOSONAR
    request = event.get("request") or {}
    sensitive_request = _is_sensitive_request(request)
    if sensitive_request:
        # Runner credentials and GraphQL mutations never leave the event.
        _scrub_sensitive_request(event, request)
    _scrub_frames(event, sensitive_request)
    _scrub_query_breadcrumbs(event)
    _scrub_sensitive_spans(event)

    # The same keys Sentry's scrubber filters, in case it is not configured (build_event_scrubber).
    _filter_sensitive_keys(event)
    return event
