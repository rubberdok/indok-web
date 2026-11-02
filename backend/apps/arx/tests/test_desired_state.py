from datetime import datetime, timedelta, timezone as dt_timezone
from unittest import TestCase as PlainTestCase

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.exceptions import ImproperlyConfigured, ValidationError as DjangoValidationError
from django.utils import timezone

from apps.arx import services
from apps.arx.services import arx_card_number, csn_candidates
from apps.arx.models import ArxAreaMapping, ArxPersonSync, ExternalBookingAccess, ExternalCardHolder, get_arx_settings
from apps.janhus.models import JanHusArea, JanHusBooking, JanHusBookingStatus
from apps.nfc.models import NfcCard, NfcCardAssignment
from apps.organizations.models import Membership, Organization
from apps.permissions.constants import HR_TYPE
from apps.permissions.models import ResponsibleGroup
from apps.arx.tests.base import ArxTestCase

User = get_user_model()


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


class ArxDesiredStateTests(ArxTestCase):
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
