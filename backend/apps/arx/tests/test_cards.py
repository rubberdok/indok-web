import json
from datetime import datetime, timedelta, timezone as dt_timezone

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.exceptions import ValidationError as DjangoValidationError
from django.urls import reverse
from django.utils import timezone

from apps.arx import services
from apps.arx.models import ArxPersonSync, ExternalBookingAccess, ExternalCardHolder
from apps.janhus.models import JanHusBooking, JanHusBookingStatus
from apps.nfc.models import NfcAccessEvent, NfcCard, NfcCardAssignment
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import UserFactory
from apps.arx.tests.base import ArxTestCase

User = get_user_model()


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


class ArxCardTests(ArxTestCase):
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
