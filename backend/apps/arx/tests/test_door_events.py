from datetime import timedelta
from unittest.mock import patch

from django.db import IntegrityError
from django.utils import timezone

from apps.arx import services
from apps.arx.models import get_arx_settings
from apps.nfc.models import NfcAccessEvent, NfcCard, NfcCardAssignment
from apps.arx.tests.base import ArxTestCase


class ArxDoorEventTests(ArxTestCase):
    def test_event_ingest_is_idempotent_and_links_the_user(self):
        # an event from yesterday, from a card assigned before it
        NfcCardAssignment.objects.filter(pk=self.assignment.pk).update(assigned_at=timezone.now() - timedelta(days=2))
        recent = int((timezone.now() - timedelta(days=1)).timestamp() * 1000)
        ev = {
            "id": "e1",
            "name": "controller.access.card.valid.pin",
            "timestamp_ms": recent,
            "dac_name": "Hus",
            "dac_external_id": "ID:1",
            "card_number": "123456789",
            "card_format": "CSN",
        }
        self.assertEqual(services.ingest_events([ev], recent)["created"], 1)
        self.assertEqual(services.ingest_events([ev], recent)["created"], 0)
        self.assertEqual(NfcAccessEvent.objects.get().resolved_user, self.user)

    def test_event_ingest_skips_missing_ids_unknown_types_and_bad_timestamps(self):
        now_ms = int(timezone.now().timestamp() * 1000)
        events = [
            {"id": "", "name": "controller.access.card.valid.standard", "timestamp_ms": now_ms},
            {"id": "unknown", "name": "irrelevant.event", "timestamp_ms": now_ms},
            {"id": "bad", "name": "controller.access.card.valid.standard", "timestamp_ms": "invalid"},
            {"id": "zero", "name": "controller.access.card.valid.standard", "timestamp_ms": 0},
        ]
        result = services.ingest_events(events, now_ms)
        self.assertEqual((result["created"], result["skipped"]), (0, 4))

    def test_duress_event_is_treated_as_access_granted(self):
        self.assertEqual(
            services._event_type("controller.access.card.duress"),
            NfcAccessEvent.EventType.ACCESS_GRANTED,
        )

    def test_event_ingest_skips_a_concurrent_duplicate(self):
        now_ms = int(timezone.now().timestamp() * 1000)
        event = {
            "id": "concurrent",
            "name": "controller.access.card.valid.standard",
            "timestamp_ms": now_ms,
            "card_number": "123456789",
            "card_format": "unknown",
        }
        with patch("apps.arx.services.NfcAccessEvent.objects.create", side_effect=IntegrityError):
            result = services.ingest_events([event], now_ms)
        self.assertEqual((result["created"], result["skipped"]), (0, 1))

    def test_event_with_an_ambiguous_number_links_nobody(self):
        cfg = get_arx_settings()
        cfg.card_number_digits = 9
        cfg.save()
        NfcCard.objects.create(mifare_csn="1123456789")
        NfcCard.objects.create(mifare_csn="2123456789")
        now_ms = int(timezone.now().timestamp() * 1000)
        ev = {
            "id": "e3",
            "name": "controller.access.card.valid.pin",
            "timestamp_ms": now_ms,
            "dac_name": "Hus",
            "dac_external_id": "ID:1",
            "card_number": "123456789",
            "card_format": "External",
        }
        services.ingest_events([ev], now_ms)
        event = NfcAccessEvent.objects.get()
        # no number either: padded to 10 digits it would be the first card's number
        self.assertEqual((event.mifare_csn_reported, event.card, event.resolved_user), ("", None, None))

    def test_unknown_card_is_logged_with_its_number_and_arx_name(self):
        now_ms = int(timezone.now().timestamp() * 1000)
        ev = {
            "id": "e2",
            "name": "controller.access.card.valid.pin",
            "timestamp_ms": now_ms,
            "dac_name": "Hus",
            "dac_external_id": "ID:1",
            "card_number": "987654321",
            "card_format": "Mifare CSN",
            "person_name": "Kari Hand-Registrert",
        }
        services.ingest_events([ev], now_ms)
        event = NfcAccessEvent.objects.get()
        self.assertEqual((event.mifare_csn_reported, event.card, event.resolved_user), ("0987654321", None, None))
        self.assertEqual(event.person_name, "Kari Hand-Registrert")
        self.assertEqual(get_arx_settings().card_digits_warning, "")  # an unknown card alone is normal

    def test_wrong_card_number_digits_is_reported_then_cleared(self):
        NfcCard.objects.create(mifare_csn="3434850820")  # synthetic
        now_ms = int(timezone.now().timestamp() * 1000)

        def event(event_id, number):
            return {
                "id": event_id,
                "name": "controller.access.card.valid.pin",
                "timestamp_ms": now_ms,
                "dac_name": "Hus",
                "dac_external_id": "ID:1",
                "card_number": number,
                "card_format": "Mifare CSN",
            }

        # card_number_digits is 0, but this reader keeps only the last 9 digits
        services.ingest_events([event("e4", "434850820")], now_ms)
        warning = get_arx_settings().card_digits_warning
        self.assertIn("card_number_digits=0, but would with 9", warning)
        self.assertNotIn("434850820", warning)  # counts only, never card numbers
        services.ingest_events([event("e5", "123456789")], now_ms)  # self.card matches normally
        self.assertEqual(get_arx_settings().card_digits_warning, "")

    def test_ingest_deletes_events_past_the_retention(self):
        old = int((timezone.now() - timedelta(days=90)).timestamp() * 1000)
        recent = int((timezone.now() - timedelta(days=1)).timestamp() * 1000)
        events = [
            {"id": "e-old", "name": "controller.door.opened", "timestamp_ms": old, "dac_name": "Hus"},
            {"id": "e-new", "name": "controller.door.opened", "timestamp_ms": recent, "dac_name": "Hus"},
        ]
        self.assertEqual(services.ingest_events(events, recent)["pruned"], 1)  # 90 days > 60
        self.assertEqual(NfcAccessEvent.objects.count(), 1)

    def test_ingest_stores_the_exit_button_with_no_card(self):
        now_ms = int(timezone.now().timestamp() * 1000)
        events = [{"id": "e-exit", "name": "controller.door.requestToExit", "timestamp_ms": now_ms, "dac_name": "Hus"}]
        services.ingest_events(events, now_ms)
        stored = NfcAccessEvent.objects.get()
        self.assertEqual(stored.event_type, NfcAccessEvent.EventType.EXIT_BUTTON)
        self.assertIsNone(stored.card)
        self.assertEqual(stored.mifare_csn_reported, "")

    def test_ingest_stores_a_forced_door(self):
        now_ms = int(timezone.now().timestamp() * 1000)
        events = [{"id": "e-forced", "name": "controller.door.forcedOpen", "timestamp_ms": now_ms, "dac_name": "Hus"}]
        services.ingest_events(events, now_ms)
        self.assertEqual(NfcAccessEvent.objects.get().event_type, NfcAccessEvent.EventType.FORCED_OPEN)
