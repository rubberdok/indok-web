"""
Tests for the ARX client: XML building and parsing (the boundary that handles
untrusted names and ARX responses) and the HTTP guards.

Needs no Django and no database, only `requests` and `defusedxml`, so it runs
three ways: in indok-web's test suite (`manage.py test apps.arx`), locally
(`python -m unittest apps.arx.test_client` from backend/), and on the runner VM
next to its copy of the client (`python3 -m unittest test_client`).
"""

from datetime import datetime, timezone
from unittest import TestCase
from unittest.mock import MagicMock

import requests
from defusedxml.common import DTDForbidden

try:
    from apps.arx import client as arx_client
except ImportError:  # on the runner VM the same file is arx_client.py
    import arx_client

ArxCircuitOpen = arx_client.ArxCircuitOpen
ArxClient = arx_client.ArxClient
ArxClientError = arx_client.ArxClientError
ArxConfigError = arx_client.ArxConfigError
ArxRejected = arx_client.ArxRejected
ArxResponseTooLarge = arx_client.ArxResponseTooLarge
PersonState = arx_client.PersonState
Window = arx_client.Window
build_import_xml = arx_client.build_import_xml
parse_category_ids = arx_client.parse_category_ids
parse_events = arx_client.parse_events
parse_export = arx_client.parse_export

CA = "/etc/arx-runner/arx-ca.pem"


class FakeResponse:
    def __init__(self, status=200, body=b"OK"):
        self.status_code = status
        self._body = body
        self.closed = False

    def iter_content(self, size):
        for i in range(0, len(self._body), size):
            yield self._body[i : i + size]

    def close(self):
        self.closed = True


def make_client(*responses, **kwargs):
    session = MagicMock()
    queue = list(responses)

    def request(*args, **kw):
        item = queue.pop(0)
        if isinstance(item, Exception):
            raise item
        return item

    session.request.side_effect = request
    client = ArxClient("https://10.99.0.2:5003", "u", "p", CA, session=session, sleep=lambda s: None, **kwargs)
    return client, session


PERSON = PersonState(
    "indok-1",
    "Ola <b>",
    "Nord & Sør",
    "1234",
    "1234567890",
    "Mifare CSN",
    (Window("cat1", datetime(2026, 10, 10, 12, tzinfo=timezone.utc), datetime(2026, 10, 12, 9, tzinfo=timezone.utc)),),
)


class TransportTests(TestCase):
    def test_plain_http_or_a_missing_ca_is_refused(self):
        for url, ca in (("http://arx:5004", CA), ("https://arx:5003", "")):
            with self.subTest(url=url, ca=ca), self.assertRaises(ArxConfigError):
                ArxClient(url, "u", "p", ca)

    def test_missing_credentials_are_refused(self):
        for username, password in (("", "p"), ("u", "")):
            with self.subTest(username=username), self.assertRaises(ArxConfigError):
                ArxClient("https://arx:5003", username, password, CA)

    def test_verify_is_never_false_and_redirects_off(self):
        client, session = make_client(FakeResponse(200, b"OK"))
        client.import_people([PERSON])
        kw = session.request.call_args.kwargs
        self.assertEqual(kw["verify"], CA)
        self.assertIsNot(kw["verify"], False)
        self.assertFalse(kw["allow_redirects"])

    def test_disallowed_endpoint_unreachable(self):
        client, session = make_client()
        with self.assertRaises(ArxConfigError):
            client._request("GET", "/arx/door_actions", max_bytes=10)
        session.request.assert_not_called()

    def test_http_errors_are_not_retried_and_leave_the_breaker_closed(self):
        cases = (
            (401, ArxClientError, lambda c: c.category_ids()),  # our mistake
            (500, ArxRejected, lambda c: c.import_people([PERSON])),  # ARX refused the data
        )
        for status, error, call in cases:
            with self.subTest(status=status):
                response = FakeResponse(status, b"bad card")
                client, session = make_client(response)
                with self.assertRaises(error):
                    call(client)
                self.assertEqual(session.request.call_count, 1)
                self.assertFalse(client._breaker.is_open)
                if status == 401:
                    self.assertTrue(response.closed)

    def test_tls_errors_are_not_retried_or_logged_with_details(self):
        client, session = make_client(requests.exceptions.SSLError("private certificate detail"))
        with self.assertLogs(arx_client.logger.name, level="WARNING") as logs:
            with self.assertRaises(arx_client.ArxTransportError):
                client.category_ids()
        self.assertEqual(session.request.call_count, 1)
        self.assertNotIn("private certificate detail", " ".join(logs.output))

    def test_temporary_http_errors_retry_and_other_statuses_fail(self):
        client, session = make_client(
            FakeResponse(502, b"unavailable"),
            FakeResponse(200, b"<access_categories><access_category><id>44</id></access_category></access_categories>"),
        )
        self.assertEqual(client.category_ids(), {"44"})
        self.assertEqual(session.request.call_count, 2)

        client, session = make_client(FakeResponse(302, b"redirect"))
        with self.assertRaises(arx_client.ArxTransportError):
            client.category_ids()
        self.assertEqual(session.request.call_count, 1)

    def test_repeated_temporary_http_errors_open_the_breaker(self):
        client, session = make_client(
            FakeResponse(502),
            FakeResponse(503),
            breaker_threshold=2,
            max_retries=2,
        )
        with self.assertRaises(arx_client.ArxTransportError):
            client.category_ids()
        self.assertEqual(session.request.call_count, 2)
        self.assertTrue(client._breaker.is_open)

    def test_breaker_allows_one_attempt_after_cooldown(self):
        now = [100.0]
        breaker = arx_client._Breaker(threshold=2, cooldown=5.0, clock=lambda: now[0])
        breaker.failure()
        breaker.failure()
        with self.assertRaises(ArxCircuitOpen):
            breaker.before()
        now[0] += 5.0
        breaker.before()
        self.assertFalse(breaker.is_open)

    def test_transport_errors_retry_then_five_failures_open_breaker(self):
        errors = [requests.ConnectionError()] * 6
        client, session = make_client(*errors, max_retries=2, breaker_threshold=5)
        with self.assertRaises(arx_client.ArxTransportError):
            client.category_ids()  # 3 attempts
        self.assertEqual(session.request.call_count, 3)
        with self.assertRaises(arx_client.ArxTransportError):
            client.category_ids()  # attempts 4 and 5 trip the breaker
        with self.assertRaises(ArxCircuitOpen):
            client.category_ids()
        self.assertEqual(session.request.call_count, 5)

    def test_response_size_cap(self):
        client, _ = make_client(FakeResponse(200, b"x" * (arx_client.MAX_IMPORT_RESPONSE_BYTES + 1)))
        with self.assertRaises(ArxResponseTooLarge):
            client.import_people([PERSON])

    def test_non_ok_import_body_is_rejection(self):
        client, _ = make_client(FakeResponse(200, b"ERROR something"))
        with self.assertRaises(ArxRejected):
            client.import_people([PERSON])

    def test_event_window_validated_and_keep_impossible(self):
        client, session = make_client()
        for start, end in ((1000, 1000 + arx_client.MAX_EVENT_WINDOW_MS + 1), (0, 10)):
            with self.subTest(start=start, end=end), self.assertRaises(ArxConfigError):
                client.events(start, end)
        session.request.assert_not_called()

    def test_logs_contain_no_secrets(self):
        client, _ = make_client(FakeResponse(200, b"OK"))
        with self.assertLogs(arx_client.logger.name, level="DEBUG") as logs:
            client.import_people([PERSON])
        joined = " ".join(logs.output)
        for secret in ("1234567890", "Ola", "Nord", "indok-1", "upfile"):
            self.assertNotIn(secret, joined)


class ImportXmlTests(TestCase):
    def test_values_are_escaped_and_windows_are_utc_without_offset(self):
        xml = build_import_xml([PERSON]).decode()
        self.assertIn("Ola &lt;b&gt;", xml)
        self.assertIn("Nord &amp; Sør", xml)
        self.assertNotIn("<b>", xml)
        self.assertIn("<start_date>2026-10-10 12:00:00</start_date>", xml)
        self.assertIn("<end_date>2026-10-12 09:00:00</end_date>", xml)

    def test_naive_window_datetime_is_refused(self):
        person = PersonState(
            "indok-2", "Kari", "Nord", "1234", "", "", (Window("cat1", datetime(2026, 10, 10), datetime(2026, 10, 11)),)
        )
        with self.assertRaises(ValueError):
            build_import_xml([person])

    def test_characters_xml_forbids_are_removed_so_the_batch_is_not_refused(self):
        odd = PersonState("indok-2", "Ola\x00\x1b", "Nord\tline\nbreak￾\ud800", "", "", "", ())
        xml = build_import_xml([odd])
        arx_client.SafeET.fromstring(xml)  # well-formed: a parser accepts it
        text = xml.decode("utf-8")
        self.assertIn("<first_name>Ola</first_name>", text)
        self.assertIn("<last_name>Nordlinebreak</last_name>", text)

    def test_retired_cards_go_to_a_holder_without_access(self):
        xml = build_import_xml([PERSON], retire=[("555", "Mifare CSN")]).decode()
        holder = xml.split("<person>")[1]
        self.assertIn(f"<id>{arx_client.RETIRED_CARD_HOLDER_ID}</id>", holder)
        self.assertIn("<pin_code />", holder)
        self.assertIn("<access_categories />", holder)
        self.assertIn(
            f"<number>555</number><format_name>Mifare CSN</format_name>"
            f"<person_id>{arx_client.RETIRED_CARD_HOLDER_ID}</person_id>",
            xml,
        )


class ParseTests(TestCase):
    def test_export_helpers_skip_deleted_cards_and_missing_names(self):
        snapshot = arx_client.ExportSnapshot(
            cards=[
                arx_client.ArxCardRow("000123", "Mifare", "deleted", True),
                arx_client.ArxCardRow("00123", "Mifare", "active", False),
            ]
        )
        self.assertEqual(snapshot.card_owner("123"), "active")
        self.assertIsNone(snapshot.card_owner("456"))
        self.assertEqual(snapshot.person_name("missing"), "")

    def test_export_keeps_names_and_cards_but_never_pins_or_deleted_people(self):
        snap = parse_export(
            b"<arxdata><persons>"
            b"<person><id>1042</id><first_name>Kari</first_name><last_name>Styret</last_name>"
            b"<pin_code>9876</pin_code></person>"
            b"<person><id>1043</id><first_name>Gone</first_name><deleted/></person>"
            b"</persons><cards><card><number>0123</number><format_name>Mifare CSN</format_name>"
            b"<person_id>1042</person_id></card></cards></arxdata>"
        )
        self.assertEqual(snap.person_names, {"1042": "Kari Styret"})
        self.assertEqual(snap.card_owner("123"), "1042")  # ARX strips leading zeros
        self.assertNotIn("9876", repr(snap))

    def test_category_ids_from_either_spelling(self):
        ids = parse_category_ids(
            b"<access_categories><access_category><id> 44 </id></access_category>"
            b"<access-category><id>45</id></access-category></access_categories>"
        )
        self.assertEqual(ids, {"44", "45"})
        # what JanHus' ARX shows for a group made by hand (export_accesscategory, 2026-10-30)
        xml = b"<access_categories><access_category><id>ID:3_1984</id></access_category></access_categories>"
        self.assertEqual(parse_category_ids(xml), {"ID:3_1984"})

    def test_events_keep_name_and_format_and_skip_malformed_ones(self):
        events, skipped = parse_events(
            b'<events><event id="1" name="controller.access.card.valid.pin" type="controller"'
            b' timestamp="1700000000000">'
            b'<argument value="Hus" type="dac" id="1" externalId="ID:1"/>'
            b'<argument value="Kari Styret" type="person" id="9"/>'
            b'<argument value="1234567890" type="card" id="1"/>'
            b'<argument value="DESFire CSN" type="card_format" id="2"/></event>'
            b'<event id="" name="x" timestamp="abc"/>'
            b'<event id="" name="x" timestamp="1700000000000"/></events>'
        )
        self.assertEqual(skipped, 2)
        (event,) = events
        self.assertEqual(
            (event.person_name, event.card_number, event.card_format, event.dac_external_id),
            ("Kari Styret", "1234567890", "DESFire CSN", "ID:1"),
        )

    def test_export_snapshot_and_event_requests_parse_their_response(self):
        export = (
            b"<arxdata><persons><person><id>indok-1</id><first_name>Kari</first_name>"
            b"<last_name>Nord</last_name></person></persons></arxdata>"
        )
        client, _ = make_client(FakeResponse(200, export))
        snapshot = client.export_snapshot()
        self.assertEqual(snapshot.person_name("indok-1"), "Kari Nord")

        event_xml = (
            b'<events><event id="e1" name="controller.access.card.duress" timestamp="1700000000000">'
            b"</event></events>"
        )
        client, session = make_client(FakeResponse(200, event_xml))
        events, skipped = client.events(1000, 2000)
        self.assertEqual((len(events), skipped), (1, 0))
        self.assertEqual(events[0].name, "controller.access.card.duress")
        self.assertIn("filter", session.request.call_args.kwargs["params"])

    def test_xml_with_a_dtd_is_refused(self):
        with self.assertRaises(DTDForbidden):
            parse_export(b'<!DOCTYPE a [<!ENTITY x "boom">]><arxdata><persons/></arxdata>')
