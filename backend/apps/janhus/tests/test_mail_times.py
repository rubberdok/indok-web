from datetime import datetime
from unittest.mock import patch
from zoneinfo import ZoneInfo

from django.test import TestCase

from apps.janhus.mail import send_booking_confirmation
from apps.janhus.models import JanHusArea, JanHusBooking, JanHusBookingStatus

OSLO = ZoneInfo("Europe/Oslo")


class JanHusMailTimesTestCase(TestCase):
    def test_mails_give_the_time_in_norway_for_a_booking_read_from_the_database(self):
        """The database hands times back in UTC, which is one or two hours from the time on the door."""
        area, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        for label, starts_at, expected in [
            ("winter", datetime(2031, 1, 15, 18, 0, tzinfo=OSLO), "15.01.2031 kl. 18:00"),
            ("summer", datetime(2031, 6, 15, 18, 0, tzinfo=OSLO), "15.06.2031 kl. 18:00"),
        ]:
            with self.subTest(label):
                booking = JanHusBooking.objects.create(
                    starts_at=starts_at,
                    ends_at=starts_at.replace(hour=20),
                    area=area,
                    status=JanHusBookingStatus.CONFIRMED,
                    booker_name="Kari",
                    booker_email="kari@example.com",
                    responsible_name="Kari",
                    responsible_email="kari@example.com",
                    responsible_phone="41234567",
                )
                booking.refresh_from_db()

                with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
                    send_booking_confirmation(booking)

                self.assertIn(expected, mocked_email.call_args.kwargs["body"])
