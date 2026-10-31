import json
import sys
from datetime import timedelta
from io import StringIO
from types import ModuleType, SimpleNamespace
from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.exceptions import ImproperlyConfigured, ValidationError
from django.core.management import CommandError, call_command
from django.db import connection
from django.test import SimpleTestCase, TestCase
from django.test.utils import CaptureQueriesContext
from django.utils import timezone

from config.sentry.scrubbing import SENSITIVE_KEYS, build_event_scrubber, scrub_event
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import UserFactory

from .models import (
    NfcAccessEvent,
    NfcCard,
    NfcCardAssignment,
    NfcSettings,
    get_or_create_nfc_settings,
    normalize_card_identifier,
    pin_cipher,
    validate_card_identifier,
)

User = get_user_model()


class NfcCardAssignmentModelTests(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_one_active_assignment_per_user(self):
        card1 = NfcCard.objects.create(mifare_csn="1234567890")
        card2 = NfcCard.objects.create(mifare_csn="1234567891")

        assignment = NfcCardAssignment.objects.create(card=card1, user=self.user)
        assignment.revoke(reason="Card replaced")

        replacement_assignment = NfcCardAssignment.objects.create(card=card2, user=self.user)

        self.assertIsNotNone(replacement_assignment.pk)

    def test_assignment_needs_a_user(self):
        card = NfcCard.objects.create(mifare_csn="1234567892")
        with self.assertRaises(ValidationError):
            NfcCardAssignment(card=card).full_clean()

    def test_assignment_status_and_deleted_user_string(self):
        card = NfcCard.objects.create(mifare_csn="1234567893")
        assignment = NfcCardAssignment.objects.create(card=card, user=self.user)
        self.assertTrue(assignment.is_active_assignment)
        self.assertIn(self.user.username, str(assignment))

        assignment.revoke(reason="Card replaced")
        self.assertFalse(assignment.is_active_assignment)
        self.user.delete()
        assignment.refresh_from_db()
        self.assertIn("(deleted user)", str(assignment))


class NfcValidationTests(SimpleTestCase):
    def test_card_identifier_length_is_capped(self):
        with self.assertRaises(ValidationError):
            validate_card_identifier("1" * 65)

    def test_pin_cipher_requires_encryption_key(self):
        with self.settings(NFC_PIN_ENCRYPTION_KEY=""), self.assertRaises(ImproperlyConfigured):
            pin_cipher()


class NfcAccessEventModelTests(TestCase):
    def test_manual_key_door_open_event(self):
        event = NfcAccessEvent.objects.create(
            event_type=NfcAccessEvent.EventType.DOOR_OPENED,
            source=NfcAccessEvent.Source.MANUAL_KEY,
            door_identifier="janus-main-door",
            notes="Opened with physical key",
        )

        self.assertEqual(event.source, NfcAccessEvent.Source.MANUAL_KEY)


class NfcSettingsModelTests(TestCase):
    def test_get_or_create_returns_singleton(self):
        first = get_or_create_nfc_settings()
        second = get_or_create_nfc_settings()

        self.assertEqual(first.pk, NfcSettings.SINGLETON_PK)
        self.assertEqual(second.pk, NfcSettings.SINGLETON_PK)
        self.assertEqual(NfcSettings.objects.count(), 1)

    def test_default_values(self):
        settings_obj = get_or_create_nfc_settings()

        self.assertTrue(settings_obj.allow_user_mifare_csn_self_service)


class CardNumberTests(TestCase):
    """Made-up UIDs only: real card UIDs must never be committed (the repo is public)."""

    # made-up NXP 7-byte UID 04 AA BB CC 11 22 33, printed after "UID" as 14392683656882692;
    # the door reads its first 4 bytes, 0xCCBBAA04 = 3434850820
    PRINTED_UID = "14392683656882692"
    DOOR_NUMBER = "3434850820"

    def test_digits_from_the_card_give_the_door_number(self):
        for raw, door_number in [
            (self.PRINTED_UID, self.DOOR_NUMBER),  # "UID" on newer cards
            ("14 392 683 656 882 692", self.DOOR_NUMBER),
            ("1234 567-890", "1234567890"),  # "mS" or "M" on older cards is the door number itself
        ]:
            with self.subTest(raw=raw):
                self.assertEqual(normalize_card_identifier(raw), door_number)

    def test_anything_else_is_refused(self):
        for raw in [
            "04:AA:BB:CC:11:22:33",  # hex is not printed on the cards
            "434850820",  # 9 digits
            "14392683656882691",  # not an NXP UID: the lowest byte is not 0x04
            "9999999999",  # 10 digits, but more than 32 bits
        ]:
            with self.subTest(raw=raw), self.assertRaises(ValidationError):
                NfcCard.objects.create(card_number=raw)

    def test_card_keeps_the_printed_number_and_derives_the_door_number(self):
        card = NfcCard.objects.create(card_number="14 392 683 656 882 692")
        self.assertEqual((card.card_number, card.mifare_csn), (self.PRINTED_UID, self.DOOR_NUMBER))
        self.assertEqual(card.number_for_display, self.PRINTED_UID)
        older = NfcCard.objects.create(mifare_csn="1234567890")  # registered before card_number existed
        self.assertEqual(older.number_for_display, "1234567890")


class PinCodeTests(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.card = NfcCard.objects.create(mifare_csn="1234567893")

    def test_pin_is_stored_encrypted_and_can_be_replaced(self):
        assignment = NfcCardAssignment.objects.create(card=self.card, user=self.user, pin_code="4321")
        assignment.refresh_from_db()
        self.assertNotIn("4321", assignment.pin_code_encrypted)
        self.assertEqual(assignment.pin_code, "4321")
        self.assertTrue(assignment.has_pin)
        assignment.pin_code = "9876"
        assignment.save(update_fields=["pin_code_encrypted"])
        assignment.refresh_from_db()
        self.assertEqual(assignment.pin_code, "9876")

    def test_invalid_pin_is_refused(self):
        for pin_code in ("98765", "١٢٣٤"):
            with self.subTest(pin_code=pin_code), self.assertRaises(ValidationError) as refused:
                NfcCardAssignment(card=self.card, user=self.user, pin_code=pin_code)
            # Sentry never rewrites exception text, so the message must not repeat what was typed.
            self.assertNotIn(pin_code, str(refused.exception))


class PinKeyChangeTests(TestCase):
    """A new PIN key never loses a PIN, and nobody has to type theirs again."""

    OLD = "b2xkLWtleS1vbGQta2V5LW9sZC1rZXktb2xkLWtleS0="  # made-up test keys (32 bytes, base64)
    NEW = "bmV3LWtleS1uZXcta2V5LW5ldy1rZXktbmV3LWtleS0="

    def setUp(self):
        with self.settings(NFC_PIN_ENCRYPTION_KEY=self.OLD):
            self.assignment = NfcCardAssignment.objects.create(
                card=NfcCard.objects.create(mifare_csn="1234567893"), user=UserFactory(), pin_code="4321"
            )

    def run_command(self, keys, *args):
        out = StringIO()
        with self.settings(NFC_PIN_ENCRYPTION_KEY=keys):
            call_command("nfc_pin_key", *args, stdout=out)
        return out.getvalue()

    def test_a_new_key_first_keeps_every_pin_readable(self):
        with self.settings(NFC_PIN_ENCRYPTION_KEY=f"{self.NEW},{self.OLD}"):
            self.assignment.refresh_from_db()
            self.assertEqual(self.assignment.pin_code, "4321")

    def test_reencrypt_moves_every_pin_to_the_new_key(self):
        report = self.run_command(f"{self.NEW},{self.OLD}", "--reencrypt")
        self.assertIn("1 on the first key, 0 on an older key, 0 unreadable", report)
        self.assertNotIn("4321", report)
        with self.settings(NFC_PIN_ENCRYPTION_KEY=self.NEW):
            self.assignment.refresh_from_db()
            self.assertEqual(self.assignment.pin_code, "4321")

    def test_a_pin_no_key_can_read_changes_nothing(self):
        token = self.assignment.pin_code_encrypted
        with self.assertRaises(CommandError):
            self.run_command(self.NEW, "--reencrypt")
        self.assignment.refresh_from_db()
        self.assertEqual(self.assignment.pin_code_encrypted, token)

    def test_check_reports_pins_still_on_the_old_key(self):
        report = self.run_command(f"{self.NEW},{self.OLD}")
        self.assertIn("0 on the first key, 1 on an older key, 0 unreadable", report)

    def test_command_requires_a_key_and_reports_unreadable_pins(self):
        with self.assertRaises(CommandError):
            self.run_command("")
        with self.assertRaises(CommandError):
            self.run_command(self.NEW)


class DoorLogQueryTests(ExtendedGraphQLTestCase):
    QUERY = """
        query {
            doorLog(limit: 10) {
                total
                events { eventType name isWebsiteUser holderKind personName mifareCsnReported cardFormat arxEvent }
            }
        }
    """

    def setUp(self):
        super().setUp()
        self.viewer = UserFactory()
        self.viewer.user_permissions.add(Permission.objects.get(codename="view_door_log"))
        self.member = UserFactory(first_name="Ola", last_name="Nordmann")
        NfcAccessEvent.objects.create(
            event_type=NfcAccessEvent.EventType.ACCESS_GRANTED,
            resolved_user=self.member,
            person_name="Ola N. (ARX)",
        )
        NfcAccessEvent.objects.create(
            event_type=NfcAccessEvent.EventType.ACCESS_DENIED,
            person_name="Kari Hand-Registrert",
            mifare_csn_reported="0987654321",
            raw_payload={"card_format": "Mifare CSN", "name": "controller.access.card.invalid.standard"},
        )

    def test_needs_the_door_log_permission(self):
        self.assert_permission_error(self.query(self.QUERY, user=UserFactory()))
        self.client.logout()
        self.assert_permission_error(self.query(self.QUERY))

    def test_door_log_filters_by_result_search_and_time(self):
        response = self.query(
            """
                query DoorLog($since: DateTime, $until: DateTime) {
                    doorLog(
                        result: "ACCESS_GRANTED"
                        search: "Ola"
                        since: $since
                        until: $until
                        offset: 0
                        limit: 1
                    ) {
                        total
                        events { id }
                    }
                }
            """,
            user=self.viewer,
            variables={
                "since": (timezone.now() - timedelta(minutes=5)).isoformat(),
                "until": (timezone.now() + timedelta(minutes=5)).isoformat(),
            },
        )
        self.assertResponseNoErrors(response)
        page = json.loads(response.content)["data"]["doorLog"]
        self.assertEqual(page["total"], 1)
        self.assertEqual(len(page["events"]), 1)

    def test_shows_website_name_first_and_arx_name_otherwise(self):
        response = self.query(self.QUERY, user=self.viewer)
        self.assertResponseNoErrors(response)
        log = json.loads(response.content)["data"]["doorLog"]
        self.assertEqual(log["total"], 2)
        names = {(e["name"], e["isWebsiteUser"], e["holderKind"]) for e in log["events"]}
        self.assertEqual(names, {("Ola Nordmann", True, "USER"), ("Kari Hand-Registrert", False, "ARX_ONLY")})
        arx_event = next(event for event in log["events"] if event["name"] == "Kari Hand-Registrert")
        self.assertEqual(
            (arx_event["cardFormat"], arx_event["arxEvent"]), ("Mifare CSN", "controller.access.card.invalid.standard")
        )

    def test_names_cost_no_query_per_event(self):
        self.client.force_login(self.viewer, backend="django.contrib.auth.backends.ModelBackend")

        def queries_for_page():
            with CaptureQueriesContext(connection) as queries:
                response = self.query(self.QUERY)
            self.assertResponseNoErrors(response)
            events = json.loads(response.content)["data"]["doorLog"]["events"]
            return len(queries), events

        before_count, before_events = queries_for_page()
        self.assertEqual(len(before_events), 2)
        for i in range(5):
            NfcAccessEvent.objects.create(
                event_type=NfcAccessEvent.EventType.ACCESS_GRANTED, resolved_user=UserFactory(first_name=f"U{i}")
            )
        after_count, after_events = queries_for_page()
        self.assertEqual(len(after_events), 7)
        self.assertEqual(after_count, before_count)


class SentryScrubbingTests(SimpleTestCase):
    """PINs and card numbers travel in GraphQL and runner requests; none may reach Sentry."""

    @staticmethod
    def event(url, data=None, frames=(), crumbs=()):
        return {
            "request": {"url": url, "data": data, "headers": {"Authorization": "Bearer x"}, "cookies": "s=1"},
            "exception": {"values": [{"stacktrace": {"frames": [dict(f) for f in frames]}}]},
            "breadcrumbs": {"values": [dict(c) for c in crumbs]},
        }

    def test_build_event_scrubber_adds_sensitive_keys(self):
        constructor = Mock(return_value="configured")
        scrubber_module = SimpleNamespace(DEFAULT_DENYLIST=("password",), EventScrubber=constructor)
        sentry_module = ModuleType("sentry_sdk")
        sentry_module.__path__ = []
        with patch.dict(sys.modules, {"sentry_sdk": sentry_module, "sentry_sdk.scrubber": scrubber_module}):
            self.assertEqual(build_event_scrubber(), "configured")
        kwargs = constructor.call_args.kwargs
        self.assertIn("password", kwargs["denylist"])
        self.assertTrue(set(SENSITIVE_KEYS).issubset(kwargs["denylist"]))
        self.assertTrue(kwargs["recursive"])

    def test_build_event_scrubber_falls_back_when_sdk_signature_is_incompatible(self):
        scrubber_module = SimpleNamespace(DEFAULT_DENYLIST=(), EventScrubber=Mock(side_effect=TypeError))
        sentry_module = ModuleType("sentry_sdk")
        sentry_module.__path__ = []
        with patch.dict(sys.modules, {"sentry_sdk": sentry_module, "sentry_sdk.scrubber": scrubber_module}):
            with self.assertLogs("config.sentry.scrubbing", level="ERROR"):
                self.assertIsNone(build_event_scrubber())

    def test_graphql_request_with_a_pin_loses_its_body_and_every_frame_local(self):
        body = {
            "query": "mutation U($u: UserInput) { updateUser(userData: $u) { ok } }",
            "variables": {"u": {"nfcPinCode": "1234"}},
        }
        frames = [
            {"module": "graphql.execution.execute", "vars": {"args": {"user_data": "..."}}},
            {"module": "django.core.handlers.base", "vars": {"request": "..."}},
        ]
        out = scrub_event(self.event("https://api.example.org/graphql/", body, frames))
        self.assertNotIn("data", out["request"])
        self.assertNotIn("cookies", out["request"])
        self.assertTrue(all("vars" not in f for f in out["exception"]["values"][0]["stacktrace"]["frames"]))
        self.assertNotIn("1234", json.dumps(out))

    def test_locals_in_nfc_users_and_arx_code_are_dropped_on_any_request(self):
        modules = ("apps.nfc.models", "apps.users.mutations", "apps.arx.services")
        frames = [{"module": m, "vars": {"value": "1234"}} for m in modules]
        frames.append({"module": "apps.events.views", "vars": {"x": 1}})
        out = scrub_event(self.event("https://api.example.org/graphql/", {"query": "{ events { id } }"}, frames))
        kept = ["vars" in f for f in out["exception"]["values"][0]["stacktrace"]["frames"]]
        self.assertEqual(kept, [False, False, False, True])
        self.assertIn("data", out["request"])  # an unrelated GraphQL body is kept for debugging

    def test_graphql_request_with_a_pin_also_loses_headers_and_extra(self):
        event = self.event("https://api.example.org/graphql/", {"query": 'mutation { x(pinCode: "1234") }'})
        event["extra"] = {"value": "1234"}
        out = scrub_event(event)
        self.assertNotIn("headers", out["request"])
        self.assertNotIn("extra", out)

    def test_the_keys_are_filtered_even_without_sentrys_own_scrubber(self):
        event = self.event("https://api.example.org/graphql/", {"query": "{ events { id } }"})
        event["extra"] = {"pin_code": "1234", "nested": [{"cardNumber": "012345678901234"}], "other": "kept"}
        out = scrub_event(event)
        self.assertEqual(out["extra"]["pin_code"], "[Filtered]")
        self.assertEqual(out["extra"]["nested"][0]["cardNumber"], "[Filtered]")
        self.assertEqual(out["extra"]["other"], "kept")

    def test_runner_requests_lose_body_and_headers(self):
        out = scrub_event(self.event("https://api.example.org/arx-runner/v1/work", '{"items": []}'))
        for key in ("data", "headers", "cookies"):
            self.assertNotIn(key, out["request"])

    def test_sql_touching_nfc_or_arx_tables_loses_its_parameters(self):
        crumbs = [
            {"category": "query", "message": "SELECT * FROM nfc_nfccard WHERE mifare_csn = %s", "data": {"p": 1}},
            {"category": "query", "message": "SELECT * FROM events_event", "data": {"p": 2}},
        ]
        out = scrub_event(self.event("https://api.example.org/graphql/", None, (), crumbs))
        self.assertEqual(["data" in c for c in out["breadcrumbs"]["values"]], [False, True])

    def test_sql_spans_and_sensitive_frames_are_scrubbed(self):
        event = self.event(
            "https://api.example.org/other/",
            frames=[
                {"module": "apps.arx.services.sync", "vars": {"pin": "1234"}},
                {"module": "apps.events.views", "vars": {"safe": True}},
            ],
        )
        event["spans"] = [
            {"description": "SELECT * FROM arx_personsync WHERE external_id = %s", "data": {"id": "indok-1"}},
            {"description": "SELECT * FROM events_event", "data": {"id": 2}},
        ]
        out = scrub_event(event)
        frames = out["exception"]["values"][0]["stacktrace"]["frames"]
        self.assertNotIn("vars", frames[0])
        self.assertIn("vars", frames[1])
        self.assertNotIn("data", out["spans"][0])
        self.assertIn("data", out["spans"][1])

    def test_denylist_keys_are_lower_case(self):
        self.assertEqual(list(SENSITIVE_KEYS), [k.lower() for k in SENSITIVE_KEYS])
