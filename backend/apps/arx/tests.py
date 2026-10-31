import hashlib
import json
from datetime import datetime, timedelta, timezone as dt_timezone
from types import SimpleNamespace
from unittest import TestCase as PlainTestCase
from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.core.exceptions import ImproperlyConfigured, ValidationError as DjangoValidationError
from django.db import DatabaseError, IntegrityError
from django.test import Client, TestCase, override_settings
from django.urls import reverse
from django.utils import timezone

from apps.arx import alerts, services, views
from apps.arx.services import arx_card_number, csn_candidates
from apps.arx.models import (
    ArxAreaMapping,
    ArxPersonSync,
    ArxSettings,
    ExternalBookingAccess,
    ExternalCardHolder,
    get_arx_settings,
)
from apps.janhus.models import JanHusArea, JanHusBooking, JanHusBookingSettings, JanHusBookingStatus
from apps.nfc.models import NfcAccessEvent, NfcCard, NfcCardAssignment
from apps.organizations.models import Membership, Organization
from apps.permissions.constants import HR_TYPE
from apps.permissions.models import ResponsibleGroup
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import UserFactory

User = get_user_model()


# ------------------------------------------------------------------ pure (no DB)


class CardNumberTests(PlainTestCase):
    """Synthetic UIDs only: real card UIDs must never be committed (the repo is public, and UIDs can be cloned)."""

    def test_arx_number_is_the_whole_csn_or_its_last_digits(self):
        self.assertEqual(arx_card_number("3434850820", 0), "3434850820")
        self.assertEqual(arx_card_number("3434850820", 9), "434850820")  # the "External" format
        self.assertEqual(arx_card_number("0123456789", 0), "123456789")

    def test_every_csn_that_shows_as_one_arx_number(self):
        self.assertEqual(
            csn_candidates("434850820", 9),
            ["0434850820", "1434850820", "2434850820", "3434850820"],
        )
        self.assertEqual(csn_candidates("434850820", 0), ["0434850820"])
        self.assertEqual(csn_candidates("12345678901", 9), [])


# -------------------------------------------------------------- services / views (DB)


@override_settings(ARX_STATE_HMAC_KEY="test-key", ARX_RUNNER_TOKEN_SHA256S=[hashlib.sha256(b"tok").hexdigest()])
class ArxServiceTests(TestCase):
    def setUp(self):
        cfg = get_arx_settings()
        cfg.sync_enabled = True
        cfg.save()
        self.area, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        ArxAreaMapping.objects.update_or_create(
            area=self.area,
            defaults={"grants_access": True, "arx_category_id": "cat-hus"},
        )
        self.user = User.objects.create(username="ola", first_name="Ola", last_name="Nord", feide_userid="f-1")
        self.card = NfcCard.objects.create(mifare_csn="0123456789")
        self.assignment = NfcCardAssignment.objects.create(card=self.card, user=self.user, pin_code="4321")
        now = timezone.now()
        self.booking = JanHusBooking.objects.create(
            starts_at=now + timedelta(days=1),
            ends_at=now + timedelta(days=2),
            area=self.area,
            status=JanHusBookingStatus.CONFIRMED,
            owner_user=self.user,
            responsible_name="Ola",
            responsible_email="o@example.org",
            responsible_phone="40000000",
        )

    def test_arx_settings_enable_timestamp_and_area_mapping_validation(self):
        cfg = get_arx_settings()
        cfg.sync_enabled = False
        cfg.save(update_fields=["sync_enabled"])
        cfg.sync_enabled = True
        cfg.save(update_fields=["sync_enabled"])
        self.assertIsNotNone(get_arx_settings().sync_enabled_at)
        self.assertEqual(str(cfg), "ARX settings")

        area = JanHusArea.objects.create(name="Ungrantable area")
        mapping = ArxAreaMapping(area=area, grants_access=True)
        with self.assertRaises(DjangoValidationError):
            mapping.full_clean()
        mapping.grants_access = False
        mapping.full_clean()
        self.assertIn("(off)", str(mapping))

    def test_desired_state_digest_requires_the_hmac_key(self):
        state = services.DesiredState("indok-1", "Ola", "Nord", "4321", "123", "Mifare", ())
        with self.settings(ARX_STATE_HMAC_KEY=""), self.assertRaises(ImproperlyConfigured):
            state.digest()

    def test_missing_user_and_holder_rows_are_ignored_during_state_reconciliation(self):
        states = services._states_for_known_people({-1}, {-1}, {}, {}, {}, get_arx_settings())
        self.assertEqual(states, {})

    def test_pending_work_respects_batch_limit(self):
        second_user = User.objects.create(username="kari", first_name="Kari", last_name="Nord", feide_userid="f-2")
        second_card = NfcCard.objects.create(mifare_csn="1234567891")
        NfcCardAssignment.objects.create(card=second_card, user=second_user, pin_code="4321")
        JanHusBooking.objects.create(
            starts_at=timezone.now() + timedelta(days=3),
            ends_at=timezone.now() + timedelta(days=4),
            area=self.area,
            status=JanHusBookingStatus.CONFIRMED,
            owner_user=second_user,
            responsible_name="Kari",
            responsible_email="k@example.org",
            responsible_phone="40000001",
        )
        self.assertEqual(len(services.pending_work(limit=1)), 1)

    def test_external_booking_in_an_unmapped_area_grants_no_window(self):
        area = JanHusArea.objects.create(name="Unmapped")
        booking = JanHusBooking.objects.create(
            starts_at=timezone.now() + timedelta(days=3),
            ends_at=timezone.now() + timedelta(days=4),
            area=area,
            owner_user=None,
            is_external_booking=True,
            booker_name="External",
            responsible_name="Responsible",
            responsible_email="external@example.org",
            responsible_phone="40000001",
            status=JanHusBookingStatus.CONFIRMED,
        )
        holder = ExternalCardHolder(name="Guest", card=NfcCard.objects.create(mifare_csn="2222222222"))
        holder.pin_code = "5555"
        holder.save()
        ExternalBookingAccess.objects.create(booking=booking, holder=holder)

        work_ids = {item["external_id"] for item in services.pending_work()}
        self.assertNotIn(f"indok-ext-{holder.pk}", work_ids)

    def test_confirmed_booking_yields_one_work_item_with_buffer(self):
        (item,) = services.pending_work()
        self.assertEqual(item["external_id"], f"indok-{self.user.pk}")
        # registered by door number only; CSN 0x075BCD15 has no NXP byte: an older card
        self.assertEqual((item["card_number"], item["card_format"]), ("123456789", "Mifare CSN"))
        (w,) = item["windows"]
        start = datetime.strptime(w["start"], services.UTC_FMT).replace(tzinfo=dt_timezone.utc)
        self.assertAlmostEqual((self.booking.starts_at - start).total_seconds(), 3600, delta=1)

    def test_repeat_poll_after_confirmed_result_is_empty(self):
        (item,) = services.pending_work()
        services.record_results([{**item, "ok": True}])
        self.assertEqual(services.pending_work(), [])

    def test_pin_change_triggers_resend(self):
        (item,) = services.pending_work()
        services.record_results([{**item, "ok": True}])
        self.assignment.pin_code = "9999"
        self.assignment.save()
        self.assertEqual(len(services.pending_work()), 1)

    def test_cancellation_converges_to_empty_state(self):
        (item,) = services.pending_work()
        services.record_results([{**item, "ok": True}])
        self.booking.status = JanHusBookingStatus.CANCELLED
        self.booking.save()
        (cleared,) = services.pending_work()
        self.assertEqual(cleared["windows"], [])
        self.assertEqual(cleared["pin"], "")
        self.assertEqual((cleared["first_name"], cleared["last_name"], cleared["card_number"]), ("", "", ""))

    def test_format_follows_the_number_printed_on_the_card(self):
        cases = (
            # made-up DESFire UID 04 AA BB CC 11 22 33, printed after "UID"
            ("14392683656882692", "3434850820", "DESFire CSN"),
            # "mS" number whose lowest byte is 0x04 (0x075BCD04): still an older card
            ("0123456772", "123456772", "Mifare CSN"),
        )
        for printed, number, card_format in cases:
            with self.subTest(printed=printed):
                self.card.card_number = printed
                self.card.save()
                (item,) = services.pending_work()
                self.assertEqual((item["card_number"], item["card_format"]), (number, card_format))

    def test_only_a_known_format_seen_at_the_door_overrides(self):
        now_ms = int(timezone.now().timestamp() * 1000)
        for event_id, seen, expected in (("e10", "External", "Mifare CSN"), ("e9", "DESFire CSN", "DESFire CSN")):
            with self.subTest(seen=seen):
                ev = {
                    "id": event_id,
                    "name": "controller.access.card.invalid.format",
                    "timestamp_ms": now_ms,
                    "dac_name": "Hus",
                    "dac_external_id": "ID:1",
                    "card_number": "123456789",
                    "card_format": seen,
                }
                services.ingest_events([ev], now_ms)
                (item,) = services.pending_work()
                self.assertEqual(item["card_format"], expected)

    def test_two_cards_with_the_same_arx_number_are_blocked(self):
        cfg = get_arx_settings()
        cfg.card_number_digits = 9  # only a cut-down format can make two cards look alike
        cfg.save()
        other = User.objects.create(username="kari", first_name="K", last_name="L")
        NfcCardAssignment.objects.create(
            card=NfcCard.objects.create(mifare_csn="1123456789"), user=other, pin_code="1111"
        )
        self.assertEqual(services.pending_work(), [])
        row = ArxPersonSync.objects.get(user=self.user)
        self.assertEqual((row.status, row.last_error), (ArxPersonSync.Status.BLOCKED, "card_ambiguous"))

    def test_sync_cannot_be_switched_on_without_a_card_format(self):
        cfg = get_arx_settings()
        cfg.card_format_desfire = ""
        with self.assertRaises(DjangoValidationError):
            cfg.save()

    def test_forged_stale_or_foreign_results_are_ignored(self):
        (item,) = services.pending_work()
        updated = services.record_results(
            [
                {**item, "ok": True, "state_hash": "0" * 64},
                {"external_id": "member-7", "ok": True, "state_hash": "x"},
            ]
        )
        self.assertEqual(updated, 0)
        self.assertEqual(ArxPersonSync.objects.get(user=self.user).synced_hash, "")
        self.assertEqual(len(services.pending_work()), 1)  # still pending

    def test_deleted_user_is_cleared_in_arx_then_forgotten(self):
        (item,) = services.pending_work()
        services.record_results([{**item, "ok": True}])
        ext = item["external_id"]
        self.booking.delete()
        self.assignment.delete()
        self.user.delete()
        (cleared,) = services.pending_work()
        self.assertEqual(cleared["external_id"], ext)
        self.assertEqual((cleared["windows"], cleared["pin"], cleared["first_name"]), ([], "", ""))
        services.record_results([{**cleared, "ok": True}])
        self.assertFalse(ArxPersonSync.objects.filter(external_id=ext).exists())

    def test_no_card_is_blocked_and_nothing_sent(self):
        self.assignment.revoke()
        self.assertEqual(services.pending_work(), [])
        self.assertEqual(ArxPersonSync.objects.get(user=self.user).status, ArxPersonSync.Status.BLOCKED)

    def test_user_without_booking_never_sent(self):
        other = User.objects.create(username="kari", first_name="K", last_name="L")
        services.pending_work()
        self.assertFalse(ArxPersonSync.objects.filter(user=other).exists())

    def test_area_toggle_or_kill_switch_off_sends_nothing(self):
        ArxAreaMapping.objects.update(grants_access=False)
        self.assertEqual(services.pending_work(), [])
        ArxAreaMapping.objects.update(grants_access=True)
        cfg = get_arx_settings()
        cfg.sync_enabled = False
        cfg.save()
        self.assertEqual(services.pending_work(), [])

    def test_error_text_is_reduced_to_a_class(self):
        (item,) = services.pending_work()
        services.record_results([{**item, "ok": False, "error": "arx rejected: card 123456789!"}])
        self.assertEqual(ArxPersonSync.objects.get().last_error, "arxrejectedcard")

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

    # ---- permanent access

    def _make_permanent(self):
        self.booking.delete()
        self.assignment.permanent_access = True
        self.assignment.save()

    def test_permanent_access_without_a_booking_until_the_flag_is_removed(self):
        self._make_permanent()
        start, end = services.permanent_window(timezone.now())
        (item,) = services.pending_work()
        self.assertEqual(item["windows"], [{"category_id": "cat-hus", "start": start, "end": end}])
        services.record_results([{**item, "ok": True}])
        self.assignment.permanent_access = False
        self.assignment.save()
        (cleared,) = services.pending_work()
        self.assertEqual((cleared["windows"], cleared["pin"]), ([], ""))

    def test_permanent_window_is_monday_midnight_oslo_plus_28_days_and_moves_weekly(self):
        monday = timezone.make_aware(datetime(2026, 10, 19, 0, 0))  # summer time; clocks go back on the Sunday
        window = ("2026-10-18T22:00:00Z", "2026-11-15T22:00:00Z")
        self.assertEqual(services.permanent_window(monday), window)
        self.assertEqual(services.permanent_window(monday + timedelta(days=6, hours=23)), window)
        self.assertEqual(services.permanent_window(monday + timedelta(days=7, hours=1))[0], "2026-10-25T23:00:00Z")

    def test_permanent_access_ends_six_months_after_graduation(self):
        self._make_permanent()
        now = timezone.make_aware(datetime(2026, 12, 20, 12, 0))  # the week's window runs to 11 January
        _, end = services.permanent_window(now)
        new_year = "2026-12-31T23:00:00Z"  # 1 January 2027, Oslo time
        for graduation_year, expected in ((None, {end}), (2027, {end}), (2026, {new_year}), (2025, set())):
            with self.subTest(graduation_year=graduation_year):
                self.user.graduation_year = graduation_year
                self.user.save()
                state = services.compute_desired_states(now).get(f"indok-{self.user.pk}")
                self.assertEqual({w[2] for w in state.windows} if state else set(), expected)

    def test_an_arx_category_id_is_used_as_it_is(self):
        ArxAreaMapping.objects.filter(area=self.area).update(arx_category_id="ID:3_1984")
        (item,) = services.pending_work()
        self.assertEqual({w["category_id"] for w in item["windows"]}, {"ID:3_1984"})

    def test_permanent_access_needs_a_pin_and_an_active_user(self):
        self._make_permanent()
        self.assignment.pin_code = ""
        self.assignment.save()
        self.assertEqual(services.pending_work(), [])
        self.assertEqual(ArxPersonSync.objects.get(user=self.user).last_error, "no_pin")
        self.assignment.pin_code = "4321"
        self.assignment.save()
        self.user.is_active = False
        self.user.save()
        self.assertEqual(services.pending_work(), [])

    # ---- card held by a person created by hand in ARX

    def _conflict(self, holder="1042"):
        (item,) = services.pending_work()
        services.record_results(
            [
                {
                    **item,
                    "ok": False,
                    "error": "card_conflict",
                    "arx_person_id": holder,
                    "arx_person_name": "Kari\x00 Styret",
                }
            ]
        )
        return ArxPersonSync.objects.get(user=self.user)

    def test_card_conflict_keeps_the_arx_name_and_waits_for_an_admin(self):
        row = self._conflict()
        self.assertEqual((row.conflict_arx_person_id, row.conflict_arx_person_name), ("1042", "Kari Styret"))
        self.assertEqual(services.pending_work(), [])  # not sent again every two minutes
        self.assignment.pin_code = "9999"
        self.assignment.save()
        self.assertEqual(len(services.pending_work()), 1)  # a change sends it again

    def test_conflict_with_one_of_our_own_ids_is_not_offered_for_takeover(self):
        row = self._conflict(holder="indok-99")
        self.assertEqual((row.conflict_arx_person_id, row.conflict_hash), ("", ""))

    def test_admin_approves_takeover_then_sync_clears_the_conflict(self):
        self._conflict()
        admin_user = User.objects.create(username="admin", is_staff=True, is_superuser=True)
        self.client.force_login(admin_user)
        row = ArxPersonSync.objects.get(user=self.user)
        changelist = reverse("admin:arx_arxpersonsync_changelist")
        page = self.client.get(changelist)
        self.assertContains(page, "Kari Styret")  # the name in ARX ...
        self.assertContains(page, "Ola Nord")  # ... next to the name on the website
        response = self.client.post(changelist, {"action": "approve_takeover", "_selected_action": [row.pk]})
        self.assertEqual(response.status_code, 302)
        row.refresh_from_db()
        self.assertEqual(
            (row.takeover_from_arx_person_id, row.takeover_card, row.takeover_approved_by),
            ("1042", self.card, admin_user),
        )
        (item,) = services.pending_work()
        self.assertEqual(item["take_card_from"], "1042")
        services.record_results([{**item, "ok": True}])
        row.refresh_from_db()
        self.assertEqual(row.status, ArxPersonSync.Status.SYNCED)
        self.assertEqual((row.conflict_arx_person_id, row.conflict_arx_person_name), ("", ""))

    def test_takeover_approval_covers_only_the_approved_card(self):
        self._conflict()
        ArxPersonSync.objects.filter(user=self.user).update(takeover_from_arx_person_id="1042", takeover_card=self.card)
        self.assignment.revoke()
        NfcCardAssignment.objects.create(
            card=NfcCard.objects.create(mifare_csn="0000000777"), user=self.user, pin_code="4321"
        )
        (item,) = services.pending_work()
        self.assertEqual(item["take_card_from"], "")

    def test_takeover_needs_its_own_permission_and_the_rows_stay_read_only(self):
        row = self._conflict()
        changelist = reverse("admin:arx_arxpersonsync_changelist")
        approve = {"action": "approve_takeover", "_selected_action": [row.pk]}
        staff = User.objects.create(username="staff", is_staff=True)
        staff.user_permissions.add(
            *Permission.objects.filter(codename__in=["view_arxpersonsync", "change_arxpersonsync"])
        )
        self.client.force_login(staff)
        self.client.post(changelist, approve)
        row.refresh_from_db()
        self.assertEqual(row.takeover_from_arx_person_id, "")  # the change permission is not enough

        approver = User.objects.create(username="approver-staff", is_staff=True)
        approver.user_permissions.add(Permission.objects.get(codename="approve_card_takeover"))
        self.client.force_login(approver)
        self.assertEqual(self.client.get(changelist).status_code, 200)
        self.client.post(changelist, approve)
        row.refresh_from_db()
        self.assertEqual(row.takeover_from_arx_person_id, "1042")
        change = self.client.post(reverse("admin:arx_arxpersonsync_change", args=[row.pk]), {"status": "SYNCED"})
        self.assertEqual(change.status_code, 403)  # the sync's own bookkeeping: superusers only

    # ---- organisation bookings

    def _card_holder(self, username, csn):
        user = User.objects.create(username=username, first_name=username, last_name="X")
        NfcCardAssignment.objects.create(card=NfcCard.objects.create(mifare_csn=csn), user=user, pin_code="1111")
        return user

    def _org_booking(self, **extra):
        org = Organization.objects.create(name="Org", slug="org")
        # The admin who approved the request has a card and PIN too: they must never get the door.
        approver = self._card_holder("approver", "3000000003")
        now = timezone.now()
        booking = JanHusBooking.objects.create(
            starts_at=now + timedelta(days=1),
            ends_at=now + timedelta(days=2),
            area=self.area,
            status=JanHusBookingStatus.CONFIRMED,
            owner_organization=org,
            booker_user=self.user,
            created_by_user=approver,
            responsible_name="Org",
            responsible_email="o@example.org",
            responsible_phone="40000000",
            **extra,
        )
        self.booking.delete()  # leave only the organisation booking
        return org, booking

    def _hr_member(self, org, username, csn):
        group = org.permission_groups.filter(group_type=HR_TYPE).first()
        if group is None:
            group = ResponsibleGroup.objects.create(
                group=Group.objects.create(name=f"hr-{org.pk}"), name="HR", organization=org, group_type=HR_TYPE
            )
        user = User.objects.create(username=username, first_name=username, last_name="X")
        Membership.objects.create(user=user, organization=org, group=group)
        card = NfcCard.objects.create(mifare_csn=csn)
        NfcCardAssignment.objects.create(card=card, user=user, pin_code="1111")
        return user

    def test_org_booking_gives_hr_members_access_not_the_booker(self):
        org, _ = self._org_booking()
        hr1 = self._hr_member(org, "hr1", "1000000001")
        hr2 = self._hr_member(org, "hr2", "1000000002")
        ids = {i["external_id"] for i in services.pending_work()}
        self.assertEqual(ids, {f"indok-{hr1.pk}", f"indok-{hr2.pk}"})

    def test_org_booking_without_leaders_gives_nobody_the_door(self):
        _, booking = self._org_booking()
        self.assertEqual(services.pending_work(), [])  # not the booker, not the approver
        booking.organization_door_access = "BOOKER_ONLY"  # what the admin page suggests
        booking.save()
        (item,) = services.pending_work()
        self.assertEqual(item["external_id"], f"indok-{self.user.pk}")

    def test_booker_only_leaves_out_the_leaders(self):
        org, _ = self._org_booking(organization_door_access="BOOKER_ONLY")
        self._hr_member(org, "hr1", "1000000001")
        (item,) = services.pending_work()
        self.assertEqual(item["external_id"], f"indok-{self.user.pk}")

    def test_the_responsible_person_follows_the_policy(self):
        responsible = self._card_holder("resp", "4000000004")
        self.booking.responsible_user = responsible
        for policy, expected in (
            ("BOOKER_ONLY", {self.user}),
            ("BOOKER_AND_RESPONSIBLE", {self.user, responsible}),
            ("ALL_PARTICIPANTS", {self.user, responsible}),
        ):
            with self.subTest(policy):
                self.booking.door_access_policy = policy
                self.booking.save()
                with_access = {i["external_id"] for i in services.pending_work() if i["windows"]}
                self.assertEqual(with_access, {f"indok-{u.pk}" for u in expected})

    def test_with_the_guest_list_policy_the_organisations_members_are_guests(self):
        org, booking = self._org_booking(door_access_policy="BOOKER_ONLY", guest_list='["f-guest"]')
        leader = self._hr_member(org, "hr1", "1000000001")
        member = self._card_holder("member", "3000000005")
        Membership.objects.create(user=member, organization=org)
        self._card_holder("outsider", "3000000006")  # has a card, but is not in the organisation
        guest = User.objects.create(username="gu", first_name="G", last_name="U", feide_userid="f-guest")
        NfcCardAssignment.objects.create(
            card=NfcCard.objects.create(mifare_csn="2000000002"), user=guest, pin_code="2222"
        )

        def with_access():
            return {i["external_id"] for i in services.pending_work() if i["windows"]}

        self.assertEqual(with_access(), {f"indok-{leader.pk}"})
        booking.door_access_policy = "ALL_PARTICIPANTS"
        booking.save()
        self.assertEqual(with_access(), {f"indok-{leader.pk}", f"indok-{member.pk}", f"indok-{guest.pk}"})

    def test_external_booking_gives_the_booker_nothing_but_follows_the_policy(self):
        self.booking.owner_user = None
        self.booking.is_external_booking = True
        self.booking.created_by_user = self.user
        self.booking.save()
        self.assertEqual(services.pending_work(), [])
        responsible = self._card_holder("resp", "4000000004")
        self.booking.responsible_user = responsible
        self.booking.door_access_policy = "BOOKER_AND_RESPONSIBLE"
        self.booking.save()
        (item,) = services.pending_work()
        self.assertEqual(item["external_id"], f"indok-{responsible.pk}")

    def test_a_deactivated_user_is_cleared(self):
        (item,) = services.pending_work()
        services.record_results([{**item, "ok": True}])
        self.user.is_active = False
        self.user.save()
        (cleared,) = services.pending_work()
        self.assertEqual((cleared["windows"], cleared["pin"], cleared["card_number"]), ([], "", ""))

    def test_sub_areas_cost_no_query_per_booking(self):
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        floor, _ = JanHusArea.objects.get_or_create(name="1. etasje", defaults={"parent": self.area})
        room = JanHusArea.objects.create(name="Rom", parent=floor)
        ArxAreaMapping.objects.create(area=room, grants_access=True, arx_category_id="cat-rom")

        def queries():
            with CaptureQueriesContext(connection) as captured:
                states = services.compute_desired_states()
            return len(captured), states

        before, states = queries()
        # booking the whole house also opens the doors mapped to the areas below it
        categories = {window[0] for window in states[f"indok-{self.user.pk}"].windows}
        self.assertEqual(categories, {"cat-hus", "cat-rom"})
        now = timezone.now()
        for i in range(4):
            JanHusBooking.objects.create(
                starts_at=now + timedelta(days=1, hours=i),
                ends_at=now + timedelta(days=1, hours=i + 1),
                area=floor,
                status=JanHusBookingStatus.CONFIRMED,
                owner_user=self.user,
                responsible_name="Ola",
                responsible_email="o@example.org",
                responsible_phone="40000000",
            )
        self.assertEqual(queries()[0], before)

    def test_hr_member_without_card_is_blocked_others_still_sent(self):
        org, _ = self._org_booking()
        ok = self._hr_member(org, "hr1", "1000000001")
        group = org.permission_groups.get(group_type=HR_TYPE)
        no_card = User.objects.create(username="hr2", first_name="h", last_name="2")
        Membership.objects.create(user=no_card, organization=org, group=group)
        ids = {i["external_id"] for i in services.pending_work()}
        self.assertEqual(ids, {f"indok-{ok.pk}"})
        self.assertEqual(ArxPersonSync.objects.get(user=no_card).status, ArxPersonSync.Status.BLOCKED)

    # ---- the email when the sync stops

    def _status(self, ok, error=""):
        return self.client.post(
            "/arx-runner/v1/status",
            {"ok": ok, "error": error},
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )

    def _alerts_on(self, **fields):
        """Sync on, the clock from the last good sync only, and a booking contact email."""
        ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK).update(
            **{"sync_enabled": True, "sync_enabled_at": None, **fields}
        )
        settings_row = JanHusBookingSettings.objects.first() or JanHusBookingSettings.objects.create()
        settings_row.booking_contact_email = "booking@example.org"
        settings_row.save()

    def test_the_runner_reports_each_sync_and_only_an_error_class_is_kept(self):
        self.assertEqual(self._status(True).status_code, 200)
        cfg = get_arx_settings()
        self.assertIsNotNone(cfg.runner_last_ok_at)
        self.assertEqual(self._status(False, "ArxUnavailable: 10.99.0.2 <b>").status_code, 200)
        self.assertEqual(get_arx_settings().runner_last_error, "ArxUnavailable...b")
        self.assertEqual(get_arx_settings().runner_last_ok_at, cfg.runner_last_ok_at)
        self.assertEqual(self._status("yes").status_code, 400)

    def test_one_mail_after_24_hours_one_more_after_72_then_nothing(self):
        now = timezone.now()
        self._alerts_on(runner_last_ok_at=now, runner_last_error="ArxUnavailable")
        with patch("apps.arx.alerts.TransactionalEmail") as mail:
            self.assertIsNone(alerts.check_runner(now + timedelta(hours=23, minutes=59)))
            self.assertEqual(alerts.check_runner(now + timedelta(hours=24, minutes=1)), alerts.STOPPED)
            self.assertIsNone(alerts.check_runner(now + timedelta(hours=30)))  # told once
            self.assertEqual(alerts.check_runner(now + timedelta(hours=72, minutes=1)), alerts.STILL_STOPPED)
            self.assertIsNone(alerts.check_runner(now + timedelta(days=30)))  # and then no more
            self.assertEqual(mail.call_count, 2)
            first, second = (call.kwargs for call in mail.call_args_list)
            self.assertEqual(first["to"], ["booking@example.org", "kontakt@rubberdok.no"])
            self.assertIn("24 timer", first["subject"])
            self.assertIn("ArxUnavailable", first["body"])
            self.assertNotIn("4321", first["body"])
            self.assertIn("72 timer", second["subject"])
            self.assertIn("siste varsel", second["body"])
        self.assertEqual(get_arx_settings().alert_stage, ArxSettings.AlertStage.AFTER_72_HOURS)

    def test_the_works_again_mail_needs_three_good_syncs_in_a_row_within_24_hours(self):
        start = timezone.now()
        self._alerts_on(runner_last_ok_at=start - timedelta(hours=25))
        with patch("apps.arx.alerts.TransactionalEmail") as mail:
            self.assertEqual(alerts.check_runner(start), alerts.STOPPED)
            alerts.record_runner_status(True, now=start + timedelta(minutes=2))
            alerts.record_runner_status(False, "ArxUnavailable", now=start + timedelta(minutes=4))  # count again
            for minutes in (6, 8):
                alerts.record_runner_status(True, now=start + timedelta(minutes=minutes))
            # more than 24 hours after the first good sync of the count: it starts again
            alerts.record_runner_status(True, now=start + timedelta(hours=25))
            self.assertEqual(mail.call_count, 1)
            self.assertIsNone(alerts.record_runner_status(True, now=start + timedelta(hours=25, minutes=2)))
            recovered = alerts.record_runner_status(True, now=start + timedelta(hours=25, minutes=4))
            self.assertEqual(recovered, alerts.RECOVERED)
            self.assertEqual(mail.call_count, 2)
            self.assertIn("virker igjen", mail.call_args.kwargs["subject"])
            self.assertIsNone(alerts.record_runner_status(True, now=start + timedelta(hours=25, minutes=6)))
            self.assertEqual(mail.call_count, 2)
        cfg = get_arx_settings()
        self.assertEqual(cfg.alert_stage, ArxSettings.AlertStage.NONE)
        self.assertEqual(cfg.recovery_good_syncs, 0)

    def test_no_works_again_mail_without_an_alert_first(self):
        now = timezone.now()
        self._alerts_on(runner_last_ok_at=now - timedelta(hours=2))
        with patch("apps.arx.alerts.TransactionalEmail") as mail:
            for minutes in (0, 2, 4, 6):
                self.assertIsNone(alerts.record_runner_status(True, now=now + timedelta(minutes=minutes)))
        mail.assert_not_called()

    def test_the_clock_starts_when_sync_is_switched_on(self):
        cfg = get_arx_settings()
        cfg.sync_enabled = False
        cfg.save()
        cfg.sync_enabled = True
        cfg.save()
        switched_on = get_arx_settings().sync_enabled_at
        self.assertIsNotNone(switched_on)
        cfg.save()  # saving again while on keeps the time
        self.assertEqual(get_arx_settings().sync_enabled_at, switched_on)
        # a runner that never worked, and one that last worked long before sync was switched on
        for last_ok in (None, switched_on - timedelta(days=5)):
            with self.subTest(last_ok=last_ok):
                self._alerts_on(sync_enabled_at=switched_on, runner_last_ok_at=last_ok, alert_stage=0)
                with patch("apps.arx.alerts.TransactionalEmail") as mail:
                    self.assertIsNone(alerts.check_runner(switched_on + timedelta(hours=23)))
                    self.assertEqual(alerts.check_runner(switched_on + timedelta(hours=24, minutes=1)), alerts.STOPPED)
                    self.assertIn("slått på", mail.call_args.kwargs["body"])

    def test_no_mail_with_sync_off_and_only_rubberdok_without_a_booking_contact(self):
        later = timezone.now() + timedelta(days=2)
        self._alerts_on(runner_last_ok_at=timezone.now(), sync_enabled=False)
        with patch("apps.arx.alerts.TransactionalEmail") as mail:
            self.assertIsNone(alerts.check_runner(later))
            mail.assert_not_called()
            ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK).update(sync_enabled=True)
            JanHusBookingSettings.objects.update(booking_contact_email="")
            self.assertEqual(alerts.check_runner(later), alerts.STOPPED)
            self.assertEqual(mail.call_args.kwargs["to"], ["kontakt@rubberdok.no"])

    @override_settings(ARX_STATE_HMAC_KEY="")
    def test_alert_check_is_off_without_the_runner_hmac_key(self):
        self.assertIsNone(alerts.check_runner())

    def test_alert_check_waits_when_there_is_no_sync_timestamp(self):
        self._alerts_on(runner_last_ok_at=None, sync_enabled_at=None)
        self.assertIsNone(alerts.check_runner())

    def test_alert_email_failure_is_logged_without_blocking_the_status_check(self):
        now = timezone.now()
        self._alerts_on(runner_last_ok_at=now - timedelta(hours=25))
        with patch("apps.arx.alerts.TransactionalEmail") as email:
            email.return_value.send.side_effect = RuntimeError("mail unavailable")
            with self.assertLogs("apps.arx.alerts", level="ERROR"):
                self.assertEqual(alerts.check_runner(now), alerts.STOPPED)
        self.assertEqual(get_arx_settings().alert_stage, ArxSettings.AlertStage.AFTER_24_HOURS)

    def test_only_one_process_sends_the_recovery_email(self):
        now = timezone.now()
        rows = Mock()
        rows.first.return_value = SimpleNamespace(
            alert_stage=ArxSettings.AlertStage.AFTER_24_HOURS,
            recovery_started_at=now - timedelta(minutes=4),
            recovery_good_syncs=2,
        )
        rows.exclude.return_value.update.return_value = 0
        with patch("apps.arx.alerts._rows", return_value=rows), patch("apps.arx.alerts.TransactionalEmail") as email:
            self.assertIsNone(alerts.record_runner_status(True, now=now))
        email.assert_not_called()

    def test_traffic_checks_at_most_every_five_minutes_and_a_failure_breaks_nothing(self):
        from apps.arx import middleware

        with patch.object(middleware.time, "monotonic", return_value=1000.0) as clock, patch.object(
            middleware.alerts, "check_runner"
        ) as check:
            handler = middleware.ArxAlertMiddleware(lambda request: "response")
            every = middleware.CHECK_EVERY_SECONDS
            for t in (0, every - 1, every + 1, every + 100, 2 * every + 2):
                clock.return_value = 1000.0 + t
                self.assertEqual(handler(None), "response")
            self.assertEqual(check.call_count, 2)

            check.side_effect = RuntimeError("mail down")
            clock.return_value = 1000.0 + 10 * every
            with self.assertLogs("apps.arx.middleware", level="ERROR"):
                self.assertEqual(handler(None), "response")

            check.side_effect = DatabaseError("database down")
            clock.return_value = 1000.0 + 11 * every
            with self.assertLogs("apps.arx.middleware", level="WARNING"):
                self.assertEqual(handler(None), "response")

    @override_settings(ARX_STATE_HMAC_KEY="")
    def test_without_the_hmac_key_the_runner_api_is_off(self):
        response = self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok")
        self.assertEqual(response.status_code, 503)

    def test_view_requires_token(self):
        self.assertEqual(self.client.get("/arx-runner/v1/work").status_code, 401)
        self.assertEqual(self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer nope").status_code, 401)
        ok = self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok")
        self.assertEqual(ok.status_code, 200)
        self.assertEqual(ok["Cache-Control"], "no-store")

    def test_machine_runner_post_uses_token_instead_of_csrf(self):
        client = Client(enforce_csrf_checks=True)
        payload = json.dumps({"ok": True})
        self.assertEqual(
            client.post("/arx-runner/v1/status", payload, content_type="application/json").status_code,
            401,
        )
        response = client.post(
            "/arx-runner/v1/status",
            payload,
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )
        self.assertEqual(response.status_code, 200)

    def test_runner_endpoints_validate_payloads_and_accept_empty_batches(self):
        cases = (
            ("/arx-runner/v1/results", b"\xff"),
            ("/arx-runner/v1/results", json.dumps({"results": "not a list"})),
            ("/arx-runner/v1/status", json.dumps({"ok": "true"})),
            ("/arx-runner/v1/events", json.dumps({"events": "not a list"})),
            ("/arx-runner/v1/events", json.dumps({"events": [], "new_cursor_ms": "invalid"})),
        )
        for path, body in cases:
            with self.subTest(path=path, body=body):
                response = self.client.post(
                    path,
                    body,
                    content_type="application/json",
                    HTTP_AUTHORIZATION="Bearer tok",
                )
                self.assertEqual(response.status_code, 400)

        results = self.client.post(
            "/arx-runner/v1/results",
            json.dumps({"results": []}),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )
        events = self.client.post(
            "/arx-runner/v1/events",
            json.dumps({"events": [], "new_cursor_ms": 1}),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )
        cursor = self.client.get("/arx-runner/v1/event-cursor", HTTP_AUTHORIZATION="Bearer tok")
        self.assertEqual(results.status_code, 200)
        self.assertEqual(events.status_code, 200)
        self.assertEqual(cursor.status_code, 200)

    def test_runner_rejects_oversized_request_bodies(self):
        response = self.client.post(
            "/arx-runner/v1/results",
            b"x" * (views.MAX_BODY_BYTES + 1),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )
        self.assertEqual(response.status_code, 413)

    def test_polling_survives_an_invalid_unrelated_setting(self):
        ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK).update(horizon_days=0)  # fails full_clean
        response = self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok")
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(get_arx_settings().runner_last_seen_at)

    def test_view_logs_do_not_contain_pin(self):
        with self.assertLogs("apps.arx", level="INFO") as logs:
            self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok")
        self.assertNotIn("4321", " ".join(logs.output))

    # ---- runner address allowlist (ArxSettings, superusers only)

    def test_runner_allowlist_from_settings(self):
        cfg = get_arx_settings()
        cases = (
            ("", False, {}, 200),  # empty: no address check
            ("203.0.113.0/29", False, {}, 403),  # the test client calls from 127.0.0.1
            ("127.0.0.1", False, {}, 200),
            # behind the load balancer the LAST X-Forwarded-For entry counts, never the first
            ("203.0.113.7", True, {"HTTP_X_FORWARDED_FOR": "203.0.113.7, 198.51.100.9"}, 403),
            ("203.0.113.7", True, {"HTTP_X_FORWARDED_FOR": "198.51.100.9, 203.0.113.7"}, 200),
            ("203.0.113.7", True, {"HTTP_X_FORWARDED_FOR": "not-an-ip"}, 403),
            ("203.0.113.7", False, {"HTTP_X_FORWARDED_FOR": "198.51.100.9, 203.0.113.7"}, 403),
        )
        for allowed, trust, headers, status in cases:
            with self.subTest(allowed=allowed, trust=trust, headers=headers):
                cfg.runner_allowed_ips, cfg.trust_x_forwarded_for = allowed, trust
                cfg.save()
                response = self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok", **headers)
                self.assertEqual(response.status_code, status)

    def test_invalid_allowlist_is_refused_on_save_and_fails_closed_if_stored(self):
        cfg = get_arx_settings()
        cfg.runner_allowed_ips = "not-an-ip"
        with self.assertRaises(DjangoValidationError):
            cfg.save()
        ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK).update(runner_allowed_ips="not-an-ip")
        self.assertEqual(self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok").status_code, 403)

    def test_only_superusers_change_settings_and_area_mappings(self):
        staff = User.objects.create(username="staff2", is_staff=True)
        staff.user_permissions.add(*Permission.objects.filter(content_type__app_label="arx"))
        self.client.force_login(staff)
        url = reverse("admin:arx_arxsettings_change", args=[ArxSettings.SINGLETON_PK])
        self.client.post(url, {"sync_enabled": "", "runner_allowed_ips": "198.51.100.1"})
        self.assertEqual(get_arx_settings().runner_allowed_ips, "")  # all model permissions are not enough
        mapping = ArxAreaMapping.objects.get()
        self.assertEqual(
            self.client.post(
                reverse("admin:arx_arxareamapping_delete", args=[mapping.pk]), {"post": "yes"}
            ).status_code,
            403,
        )
        self.assertTrue(ArxAreaMapping.objects.filter(pk=mapping.pk).exists())

    # ---- external cards (Django admin)

    def _external_holder(self, booking=None, csn="2222222222", pin="5555"):
        holder = ExternalCardHolder(name="Ekstern Gjest", card=NfcCard.objects.create(mifare_csn=csn))
        holder.pin_code = pin
        holder.save()
        if booking is not None:
            ExternalBookingAccess.objects.create(booking=booking, holder=holder)
        return holder

    def _external_booking(self):
        now = timezone.now()
        return JanHusBooking.objects.create(
            starts_at=now + timedelta(days=3),
            ends_at=now + timedelta(days=4),
            area=self.area,
            status=JanHusBookingStatus.CONFIRMED,
            is_external_booking=True,
            booker_name="Ekstern",
            responsible_name="Ekstern",
            responsible_email="e@example.org",
            responsible_phone="40000000",
        )

    def test_external_card_gets_only_its_booking_window(self):
        booking = self._external_booking()
        holder = self._external_holder(booking)
        items = {i["external_id"]: i for i in services.pending_work()}
        item = items[f"indok-ext-{holder.pk}"]
        self.assertEqual(
            (item["first_name"], item["pin"], item["card_number"]), ("Ekstern Gjest", "5555", "2222222222")
        )
        (window,) = item["windows"]
        start = datetime.strptime(window["start"], services.UTC_FMT).replace(tzinfo=dt_timezone.utc)
        self.assertAlmostEqual((booking.starts_at - start).total_seconds(), 3600, delta=1)
        self.assertEqual(ArxPersonSync.objects.get(external_id=item["external_id"]).external_holder, holder)

    def test_external_holder_validation_and_access_string(self):
        holder = ExternalCardHolder(name="Ekstern", card=self.card)
        self.assertFalse(holder.has_pin)
        holder.pin_code = "5555"
        self.assertTrue(holder.has_pin)
        self.assertEqual(str(holder), "Ekstern (external card)")
        with self.assertRaises(DjangoValidationError):
            holder.full_clean()

        external_booking = self._external_booking()
        external_holder = self._external_holder()
        access = ExternalBookingAccess.objects.create(booking=external_booking, holder=external_holder)
        self.assertEqual(str(access), f"Ekstern Gjest -> booking {external_booking.pk}")

    def test_external_card_without_access_or_booking_is_never_sent(self):
        holder = self._external_holder()  # no booking
        unconfirmed = self._external_booking()
        unconfirmed.status = JanHusBookingStatus.PENDING_ADMIN_REVIEW
        unconfirmed.save()
        ExternalBookingAccess.objects.create(booking=unconfirmed, holder=holder)
        self.assertNotIn(f"indok-ext-{holder.pk}", {i["external_id"] for i in services.pending_work()})

    def test_cancelled_booking_clears_the_external_card_then_deleting_the_holder_forgets_it(self):
        booking = self._external_booking()
        holder = self._external_holder(booking)
        ext = f"indok-ext-{holder.pk}"
        (item,) = [i for i in services.pending_work() if i["external_id"] == ext]
        services.record_results([{**item, "ok": True}])
        booking.status = JanHusBookingStatus.CANCELLED
        booking.save()
        (cleared,) = [i for i in services.pending_work() if i["external_id"] == ext]
        self.assertEqual((cleared["windows"], cleared["pin"], cleared["first_name"]), ([], "", ""))
        services.record_results([{**cleared, "ok": True}])
        self.assertTrue(ArxPersonSync.objects.filter(external_id=ext).exists())  # the holder still exists
        holder.delete()  # ARX was already cleared, so the row is simply removed
        services.pending_work()
        self.assertFalse(ArxPersonSync.objects.filter(external_id=ext).exists())

    def test_card_both_external_and_on_a_user_blocks_both(self):
        booking = self._external_booking()
        holder = ExternalCardHolder(name="Ekstern", card=self.card)  # self.card is the user's card
        holder.pin_code = "5555"
        holder.save()
        ExternalBookingAccess.objects.create(booking=booking, holder=holder)
        services.pending_work()
        blocked = dict(ArxPersonSync.objects.values_list("external_id", "last_error"))
        self.assertEqual(blocked[f"indok-ext-{holder.pk}"], "card_ambiguous")
        self.assertEqual(blocked[f"indok-{self.user.pk}"], "card_ambiguous")

    def test_admin_form_refuses_a_users_card_and_needs_a_pin(self):
        from apps.arx.admin import ExternalCardHolderForm

        on_user = ExternalCardHolderForm(data={"name": "X", "card_number_input": self.card.mifare_csn, "pin": "1234"})
        self.assertIn("card_number_input", on_user.errors)
        no_pin = ExternalCardHolderForm(data={"name": "X", "card_number_input": "1234567893", "pin": ""})
        self.assertIn("pin", no_pin.errors)
        good = ExternalCardHolderForm(data={"name": "X", "card_number_input": "1234567893", "pin": "1234"})
        self.assertTrue(good.is_valid(), good.errors)
        holder = good.save()
        self.assertEqual((holder.card.mifare_csn, holder.pin_code), ("1234567893", "1234"))
        self.assertNotIn("1234", holder.pin_code_encrypted)

    def test_external_card_holder_admin_pages_open(self):
        admin_user = User.objects.create_superuser(
            username="admin-probe",
            email="a@example.org",
            password="test-password",
        )
        self.client.force_login(admin_user, backend="django.contrib.auth.backends.ModelBackend")
        response = self.client.get(reverse("admin:arx_externalcardholder_add"))
        self.assertEqual(response.status_code, 200)

    def test_external_cards_admin_needs_its_permission(self):
        staff = User.objects.create(username="staff3", is_staff=True)
        self.client.force_login(staff)
        url = reverse("admin:arx_externalcardholder_changelist")
        self.assertEqual(self.client.get(url).status_code, 403)
        staff.user_permissions.add(Permission.objects.get(codename="manage_external_card_access"))
        self.assertEqual(self.client.get(url).status_code, 200)


class ExternalCardDoorLogTests(ExtendedGraphQLTestCase):
    def test_an_external_card_shows_its_holder_in_the_door_log(self):
        card = NfcCard.objects.create(mifare_csn="3777777777")
        ExternalCardHolder.objects.create(name="Ekstern Gjest", card=card)
        NfcAccessEvent.objects.create(
            event_type=NfcAccessEvent.EventType.ACCESS_GRANTED, card=card, person_name="Navn i ARX"
        )
        viewer = UserFactory()
        viewer.user_permissions.add(Permission.objects.get(codename="view_door_log"))

        response = self.query("query { doorLog { events { name isWebsiteUser holderKind } } }", user=viewer)
        self.assertResponseNoErrors(response)
        (event,) = json.loads(response.content)["data"]["doorLog"]["events"]
        self.assertEqual(event, {"name": "Ekstern Gjest", "isWebsiteUser": False, "holderKind": "EXTERNAL_CARD"})
