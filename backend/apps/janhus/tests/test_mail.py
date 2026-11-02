from datetime import datetime, time, timedelta
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone

from apps.janhus import mail
from apps.janhus.mail import (
    send_booking_confirmation,
    send_booking_declined,
    send_booking_deleted,
    send_booking_request_received,
    send_booking_request_rejected,
)
from apps.janhus.models import (
    JanHusArea,
    JanHusBooking,
    JanHusBookingRequest,
    JanHusBookingSettings,
    JanHusBookingStatus,
)


class JanHusMailTestCase(TestCase):
    def _confirmed_booking(self, **overrides):
        start_dt = timezone.make_aware(datetime.combine((timezone.now() + timedelta(days=7)).date(), time(12, 0)))
        area, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        defaults = dict(
            starts_at=start_dt,
            ends_at=start_dt + timedelta(hours=2),
            area=area,
            status=JanHusBookingStatus.CONFIRMED,
            booker_name="Booker Bookersen",
            booker_email="booker@example.com",
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
        )
        defaults.update(overrides)
        return JanHusBooking.objects.create(**defaults)

    def test_confirmation_mail_contains_reference_and_reaches_both_contacts(self):
        booking = self._confirmed_booking()

        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
            send_booking_confirmation(booking)

        mocked_email.assert_called_once()
        kwargs = mocked_email.call_args.kwargs

        self.assertEqual("janhus-booking-confirmations", kwargs["stream"])
        self.assertEqual(mail.SUBJECTS["decision"] + booking.area.name, kwargs["subject"])
        self.assertIn(booking.reference, kwargs["body"])
        # bcc, so the two contacts do not see each other's address
        self.assertCountEqual(["booker@example.com", "responsible@example.com"], kwargs["bcc"])

    def _booking_request(self, **overrides):
        start_dt = timezone.make_aware(datetime.combine((timezone.now() + timedelta(days=7)).date(), time(12, 0)))
        area, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        defaults = dict(
            starts_at=start_dt,
            ends_at=start_dt + timedelta(hours=2),
            area=area,
            requester_name="Kari Nordmann",
            requester_email="kari@example.com",
            requester_phone="41234567",
            responsible_name="Ola Nordmann",
            responsible_email="ola@example.com",
            responsible_phone="41234567",
        )
        defaults.update(overrides)
        return JanHusBookingRequest.objects.create(**defaults)

    def test_request_receipt_also_notifies_the_configured_admin_address(self):
        JanHusBookingSettings.objects.create(booking_contact_email="janhus@example.com")
        booking_request = self._booking_request()

        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
            send_booking_request_received(booking_request)

        self.assertEqual(2, mocked_email.call_count)
        admin_kwargs = mocked_email.call_args_list[1].kwargs
        self.assertEqual(["janhus@example.com"], admin_kwargs["bcc"])
        self.assertTrue(admin_kwargs["subject"].startswith(mail.SUBJECTS["admin_reserve"]))
        self.assertIn("kari@example.com", admin_kwargs["body"])

    def test_delivery_failure_is_logged_and_does_not_propagate(self):
        """
        Mail is sent after the booking has already been saved, so a Postmark
        outage must not surface as a mutation error — but it must not vanish
        either.
        """
        booking = self._confirmed_booking()

        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
            mocked_email.return_value.send.side_effect = RuntimeError("postmark down")

            with self.assertLogs("apps.janhus.mail", level="ERROR") as logs:
                send_booking_confirmation(booking)

        self.assertTrue(any("Could not send JanHus email" in line for line in logs.output))

    def test_confirmation_mail_attaches_the_contract_pdf(self):
        booking = self._confirmed_booking()

        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
            send_booking_confirmation(booking)

        mocked_email.return_value.attach.assert_called_once()
        name, content, mimetype = mocked_email.return_value.attach.call_args.args

        self.assertEqual("Kontrakt.pdf", name)
        self.assertEqual("application/pdf", mimetype)
        self.assertTrue(content.startswith(b"%PDF-"))

    def test_the_status_mails_carry_the_message_to_the_booker_not_the_internal_comment(self):
        booking = self._confirmed_booking(
            booker_message="Nøkkelen ligger i postkassen.", admin_comment="Intern: sjekk depositum"
        )
        booking_request = self._booking_request(
            booker_message="Prøv gjerne en annen dag.", admin_comment="Intern: dobbeltbooket"
        )
        cases = [
            ("confirmed", lambda: send_booking_confirmation(booking), "Nøkkelen ligger i postkassen."),
            ("declined", lambda: send_booking_declined(booking), "Nøkkelen ligger i postkassen."),
            ("rejected", lambda: send_booking_request_rejected(booking_request), "Prøv gjerne en annen dag."),
        ]
        for label, send, message in cases:
            with self.subTest(label):
                with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
                    send()
                body = mocked_email.call_args.kwargs["body"]
                self.assertIn(message, body)
                self.assertNotIn("Intern:", body)
                html = mocked_email.return_value.attach_alternative.call_args.args[0]
                self.assertNotIn("Intern:", html)

    def test_the_deletion_mail_names_the_booking_and_the_message(self):
        booking = self._confirmed_booking()

        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
            send_booking_deleted(booking, message="Huset er stengt for vedlikehold.")

        kwargs = mocked_email.call_args.kwargs
        self.assertEqual(mail.SUBJECTS["deleted"] + booking.area.name, kwargs["subject"])
        self.assertIn(booking.reference, kwargs["body"])
        self.assertIn("Huset er stengt for vedlikehold.", kwargs["body"])
        self.assertCountEqual(["booker@example.com", "responsible@example.com"], kwargs["bcc"])
