"""
Minimal client for the ASSA ABLOY ARX integration API (HTTPS + Basic auth).

This module is deliberately Django-free: the same file runs inside the JanHus
runner (production path) and could run inside the backend (VPN fallback).

Rules enforced here, not left to callers:
- https:// only, TLS verification always on against an explicit CA/pinned cert.
- Only the five (method, path) pairs in ALLOWED can be called. Door control,
  alarm, calendar, SSO and status endpoints are unreachable from this client.
- 4xx and ARX "500 + error text" are never retried and never trip the breaker;
  only transport errors and 502/503/504 do.
- Responses are size-capped and parsed with defusedxml.
- Nothing from a request or response body is ever logged.
"""

import logging
import re
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Callable, Iterable, Optional
from xml.etree import ElementTree as ET

import requests
from defusedxml import ElementTree as SafeET

logger = logging.getLogger(__name__)

ALLOWED = frozenset(
    {
        ("POST", "/arx/import"),
        ("GET", "/arx/export"),
        ("GET", "/arx/eventexport"),
        ("GET", "/arx/export_accesscategory"),
        ("GET", "/arx/export_accessarea"),
    }
)

# Cards taken away from one of our persons are moved to this holder, which never
# has a PIN or a category. Moving a card only relies on the documented upsert;
# it does not depend on how ARX treats <deleted/> on import.
RETIRED_CARD_HOLDER_ID = "indok-retired-cards"

MAX_IMPORT_RESPONSE_BYTES = 64 * 1024
MAX_EXPORT_RESPONSE_BYTES = 32 * 1024 * 1024
MAX_FIELD_LENGTH = 200
MAX_EVENT_WINDOW_MS = 24 * 3600 * 1000

# ARX event names we care about (Integration Guide 4.1.4, list of events).
# Event export filters take exact names.
DOOR_EVENT_NAMES = (
    "controller.access.card.valid.standard",  # access
    "controller.access.card.valid.pin",  # access with PIN
    "controller.access.card.duress",  # access under duress
    "controller.access.card.invalid.standard",  # card number with no owner
    "controller.access.card.invalid.format",
    "controller.access.card.invalid.category",
    "controller.access.card.invalid.schedule",
    "controller.access.card.invalid.door",
    "controller.access.card.invalid.inhibited",
    "controller.access.card.invalid.pin",
    "controller.access.card.invalid.pinAttempts",
    "controller.access.card.invalid.pinTimeout",
    "controller.door.opened",
)


class ArxError(Exception):
    """Base class. str(exc) never contains request or response data."""


class ArxConfigError(ArxError):
    """Bad configuration or a call outside the allowlist. Never retried."""


class ArxClientError(ArxError):
    """HTTP 4xx (bad login, forbidden, not found). Never retried."""

    def __init__(self, status: int):
        super().__init__(f"ARX returned HTTP {status}")
        self.status = status


class ArxRejected(ArxError):
    """ARX answered 500 / non-OK text: it understood and refused the data.
    `detail` is truncated ARX text; it may contain personal data, so callers
    must not log it."""

    def __init__(self, detail: str = ""):
        super().__init__("ARX rejected the request")
        self.detail = detail[:MAX_FIELD_LENGTH]


class ArxTransportError(ArxError):
    """Connection, TLS, timeout or 502/503/504 after retries."""


class ArxCircuitOpen(ArxError):
    """Breaker is open; no request was sent."""


class ArxResponseTooLarge(ArxError):
    pass


class _Breaker:
    def __init__(self, threshold: int, cooldown: float, clock: Callable[[], float]):
        self._threshold = threshold
        self._cooldown = cooldown
        self._clock = clock
        self._failures = 0
        self._opened_at: Optional[float] = None

    def before(self) -> None:
        if self._opened_at is None:
            return
        if self._clock() - self._opened_at >= self._cooldown:
            self._opened_at = None  # half-open: let one attempt through
            self._failures = self._threshold - 1
            return
        raise ArxCircuitOpen("ARX circuit breaker is open")

    def success(self) -> None:
        self._failures = 0
        self._opened_at = None

    def failure(self) -> None:
        self._failures += 1
        if self._failures >= self._threshold:
            self._opened_at = self._clock()

    @property
    def is_open(self) -> bool:
        return self._opened_at is not None


# --------------------------------------------------------------------------- data


@dataclass(frozen=True)
class Window:
    category_id: str
    start: datetime  # timezone-aware
    end: datetime  # timezone-aware


@dataclass(frozen=True)
class PersonState:
    """Full desired ARX state for one person we own (external id indok-<pk>)."""

    external_id: str
    first_name: str
    last_name: str
    pin: str  # 4 digits or "" (empty clears)
    card_number: str  # digits, "" if none
    card_format: str
    windows: tuple = ()


@dataclass(frozen=True)
class ArxCardRow:
    number: str
    format_name: str
    person_id: str
    deleted: bool


@dataclass
class ExportSnapshot:
    person_ids: set = field(default_factory=set)
    cards: list = field(default_factory=list)
    # "first last" per person id; only used to tell an admin who holds a card in ARX
    person_names: dict = field(default_factory=dict)

    def person_name(self, person_id: str) -> str:
        return self.person_names.get(person_id, "")

    def card_owner(self, number: str) -> Optional[str]:
        """person_id owning this card number (leading zeros are stripped by ARX)."""
        wanted = number.lstrip("0")
        for card in self.cards:
            if card.deleted:
                continue
            if card.number.lstrip("0") == wanted:
                return card.person_id
        return None


@dataclass(frozen=True)
class ArxEvent:
    event_id: str
    name: str
    timestamp_ms: int
    dac_external_id: str
    dac_name: str
    card_number: str
    card_format: str
    person_name: str = ""  # the holder's name in ARX, shown in the website's door log


# ----------------------------------------------------------------- XML (de)serialise


def _utc(dt: datetime) -> str:
    if dt.tzinfo is None:
        raise ValueError("naive datetime")
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


# Characters XML 1.0 forbids (most C0 controls, lone surrogates, U+FFFE, U+FFFF), plus
# tab and line breaks: none belongs in a name or an id, and one would make ARX refuse
# the whole import batch. ElementTree escapes & < > but passes these through unchanged.
_NOT_XML_TEXT = re.compile(r"[\x00-\x1f\ud800-\udfff￾￿]")


def _xml_text(value) -> str:
    return _NOT_XML_TEXT.sub("", str(value or ""))


def _text(parent: ET.Element, tag: str, value: str) -> ET.Element:
    el = ET.SubElement(parent, tag)
    el.text = _xml_text(value)
    return el


def _empty_person(parent: ET.Element, external_id: str, first_name: str) -> None:
    person = ET.SubElement(parent, "person")
    _text(person, "id", external_id)
    _text(person, "first_name", first_name)
    _text(person, "last_name", "")
    _text(person, "pin_code", "")
    ET.SubElement(person, "access_categories")


def build_import_xml(people: Iterable[PersonState], retire: Iterable[tuple] = ()) -> bytes:
    """
    One <person> per PersonState. We send <access_categories> as the *complete*
    list: safe only because every person we send is one the backend owns
    (id prefix enforced by the caller), so wiping foreign categories is intended.
    `retire` = (card number, format name) pairs to move to RETIRED_CARD_HOLDER_ID.
    All values go through ElementTree, so names cannot inject markup.
    """
    retire = list(retire)
    root = ET.Element("arxdata")
    persons_el = ET.SubElement(root, "persons")
    cards_el = ET.Element("cards")
    if retire:
        # re-asserted every time: no PIN, no categories, whatever someone set by hand
        _empty_person(persons_el, RETIRED_CARD_HOLDER_ID, "indok retired cards")
    for number, format_name in retire:
        card = ET.SubElement(cards_el, "card")
        _text(card, "number", number)
        _text(card, "format_name", format_name)
        _text(card, "person_id", RETIRED_CARD_HOLDER_ID)
    for p in people:
        person = ET.SubElement(persons_el, "person")
        _text(person, "id", p.external_id)
        _text(person, "first_name", p.first_name)
        _text(person, "last_name", p.last_name)
        _text(person, "pin_code", p.pin)
        cats = ET.SubElement(person, "access_categories")
        for w in p.windows:
            cat = ET.SubElement(cats, "access_category")
            _text(cat, "id", w.category_id)
            _text(cat, "start_date", _utc(w.start))
            _text(cat, "end_date", _utc(w.end))
        if p.card_number:
            card = ET.SubElement(cards_el, "card")
            _text(card, "number", p.card_number)
            _text(card, "format_name", p.card_format)
            _text(card, "person_id", p.external_id)
    if len(cards_el):
        root.append(cards_el)
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def _child_text(el, tag: str) -> str:
    child = el.find(tag)
    return (child.text or "") if child is not None else ""


def parse_export(xml_bytes: bytes) -> ExportSnapshot:
    """
    Ids, names and cards only. The export also holds every ARX person's PIN; that
    element is deliberately never read, so no PIN outlives the parse.
    """
    root = SafeET.fromstring(xml_bytes, forbid_dtd=True)
    snap = ExportSnapshot()
    for person in root.iter("person"):
        pid = _child_text(person, "id")[:MAX_FIELD_LENGTH]
        if pid and person.find("deleted") is None:
            snap.person_ids.add(pid)
            name = f'{_child_text(person, "first_name")} {_child_text(person, "last_name")}'.strip()
            snap.person_names[pid] = name[:MAX_FIELD_LENGTH]
    for card in root.iter("card"):
        snap.cards.append(
            ArxCardRow(
                number=_child_text(card, "number").strip()[:MAX_FIELD_LENGTH],
                format_name=_child_text(card, "format_name")[:MAX_FIELD_LENGTH],
                person_id=_child_text(card, "person_id")[:MAX_FIELD_LENGTH],
                deleted=card.find("deleted") is not None,
            )
        )
    return snap


def parse_category_ids(xml_bytes: bytes) -> set:
    root = SafeET.fromstring(xml_bytes, forbid_dtd=True)
    ids = set()
    for tag in ("access_category", "access-category"):
        for cat in root.iter(tag):
            value = _child_text(cat, "id").strip()
            if value:
                ids.add(value[:MAX_FIELD_LENGTH])
    return ids


def parse_events(xml_bytes: bytes) -> tuple:
    """Returns (events, skipped_count). Malformed events are skipped, not raised."""
    root = SafeET.fromstring(xml_bytes, forbid_dtd=True)
    events, skipped = [], 0
    for ev in root.iter("event"):
        try:
            event_id = ev.attrib["id"]
            name = ev.attrib["name"]
            ts = int(ev.attrib["timestamp"])
            if not event_id or len(event_id) > 64 or len(name) > MAX_FIELD_LENGTH or ts <= 0:
                raise ValueError
            dac_ext = dac_name = card = card_fmt = person = ""
            for arg in ev.iter("argument"):
                kind = arg.attrib.get("type", "")
                if kind == "dac":
                    dac_name = arg.attrib.get("value", "")[:MAX_FIELD_LENGTH]
                    dac_ext = arg.attrib.get("externalId", "")[:MAX_FIELD_LENGTH]
                elif kind == "card":
                    card = arg.attrib.get("value", "")[:MAX_FIELD_LENGTH]
                elif kind == "card_format":
                    card_fmt = arg.attrib.get("value", "")[:MAX_FIELD_LENGTH]
                elif kind == "person":
                    person = arg.attrib.get("value", "")[:MAX_FIELD_LENGTH]
            events.append(ArxEvent(event_id, name, ts, dac_ext, dac_name, card, card_fmt, person))
        except (KeyError, ValueError):
            skipped += 1
    return events, skipped


# ----------------------------------------------------------------------------- client


class ArxClient:
    def __init__(
        self,
        base_url: str,
        username: str,
        password: str,
        ca_bundle: str,
        *,
        timeout: tuple = (3.05, 30),
        max_retries: int = 2,
        breaker_threshold: int = 5,
        breaker_cooldown: float = 300.0,
        session: Optional[requests.Session] = None,
        sleep: Callable[[float], None] = time.sleep,
        clock: Callable[[], float] = time.monotonic,
    ):
        if not base_url.lower().startswith("https://"):
            raise ArxConfigError("ARX base URL must use https://")
        if not ca_bundle:
            raise ArxConfigError("A CA bundle / pinned ARX certificate is required")
        if not username or not password:
            raise ArxConfigError("ARX credentials missing")
        self._base = base_url.rstrip("/")
        self._auth = (username, password)
        self._ca_bundle = ca_bundle  # passed as verify=; never False
        self._timeout = timeout
        self._max_retries = max_retries
        self._session = session or requests.Session()
        self._sleep = sleep
        self._breaker = _Breaker(breaker_threshold, breaker_cooldown, clock)

    # ---- low level

    def _read_response(self, resp, max_bytes: int) -> Optional[bytes]:
        status = resp.status_code
        if status == 200:
            body = self._read_capped(resp, max_bytes)
            self._breaker.success()
            return body
        if 400 <= status < 500:
            resp.close()
            raise ArxClientError(status)
        if status == 500:
            detail = self._read_capped(resp, 4096).decode("utf-8", "replace")
            raise ArxRejected(detail)
        resp.close()
        if status in (502, 503, 504):
            return None
        raise ArxTransportError(f"unexpected HTTP {status}")

    def _request(self, method: str, path: str, *, params=None, files=None, max_bytes: int) -> bytes:
        if (method, path) not in ALLOWED:
            raise ArxConfigError("endpoint not allowed")
        self._breaker.before()
        last_exc: Optional[Exception] = None
        for attempt in range(self._max_retries + 1):
            started = time.monotonic()
            try:
                resp = self._session.request(
                    method,
                    self._base + path,
                    params=params,
                    files=files,
                    auth=self._auth,
                    timeout=self._timeout,
                    verify=self._ca_bundle,
                    allow_redirects=False,
                    stream=True,
                )
            except requests.exceptions.SSLError as exc:
                self._breaker.failure()
                logger.warning("ARX %s %s TLS error", method, path)
                raise ArxTransportError("TLS verification failed") from exc
            except (requests.ConnectionError, requests.Timeout) as exc:
                self._breaker.failure()
                last_exc = exc
                logger.warning("ARX %s %s transport error (attempt %d)", method, path, attempt + 1)
                if self._breaker.is_open:
                    break  # stop hammering a dead server mid-retry
                self._backoff(attempt)
                continue

            status = resp.status_code
            logger.info("ARX %s %s -> %s in %.2fs", method, path, status, time.monotonic() - started)
            body = self._read_response(resp, max_bytes)
            if body is not None:
                return body
            self._breaker.failure()
            last_exc = ArxTransportError(f"HTTP {status}")
            if self._breaker.is_open:
                break
            self._backoff(attempt)
        raise ArxTransportError("ARX unreachable after retries") from last_exc

    def _backoff(self, attempt: int) -> None:
        if attempt < self._max_retries:
            self._sleep(min(2**attempt, 8))

    @staticmethod
    def _read_capped(resp, limit: int) -> bytes:
        chunks, total = [], 0
        for chunk in resp.iter_content(65536):
            total += len(chunk)
            if total > limit:
                resp.close()
                raise ArxResponseTooLarge("ARX response exceeds size limit")
            chunks.append(chunk)
        return b"".join(chunks)

    # ---- high level (only what the integration needs)

    def import_people(self, people: list, retire: Iterable[tuple] = ()) -> None:
        """Upsert. Repeating the same call is harmless, so transport retries are safe."""
        xml = build_import_xml(people, retire)
        body = self._request(
            "POST",
            "/arx/import",
            files={"upfile": ("import.xml", xml, "text/xml")},
            max_bytes=MAX_IMPORT_RESPONSE_BYTES,
        )
        if not body.strip().upper().startswith(b"OK"):
            raise ArxRejected(body.decode("utf-8", "replace"))

    def export_snapshot(self) -> ExportSnapshot:
        """All persons and cards, no pictures and no MyPages passwords (flags never sent)."""
        body = self._request(
            "GET",
            "/arx/export",
            params={"exclude_deleted": "true"},
            max_bytes=MAX_EXPORT_RESPONSE_BYTES,
        )
        return parse_export(body)

    def category_ids(self) -> set:
        body = self._request("GET", "/arx/export_accesscategory", max_bytes=MAX_EXPORT_RESPONSE_BYTES)
        return parse_category_ids(body)

    def events(self, start_ms: int, end_ms: int) -> tuple:
        """Door events in [start_ms, end_ms]. Window is capped; 'keep' is impossible by type."""
        if not (0 < start_ms < end_ms) or end_ms - start_ms > MAX_EVENT_WINDOW_MS:
            raise ArxConfigError("invalid event window")
        flt = "<filter><name>" + "".join(f"<mask>{n}</mask>" for n in DOOR_EVENT_NAMES) + "</name></filter>"
        body = self._request(
            "GET",
            "/arx/eventexport",
            params={
                "start_date": str(int(start_ms)),
                "end_date": str(int(end_ms)),
                "filter": flt,
                "unsorted": "true",
            },
            max_bytes=MAX_EXPORT_RESPONSE_BYTES,
        )
        return parse_events(body)
