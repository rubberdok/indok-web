import json
from datetime import datetime, time, timedelta
from unittest.mock import patch

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase
from django.utils import timezone

from apps.janhus.mail import send_pending_review_notification
from apps.janhus.models import JanHusBooking, JanHusBookingRequest, JanHusBookingSettings, JanHusBookingStatus
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import UserFactory


class JanHusBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.user = UserFactory(is_indok=True)
        self.other_user = UserFactory(is_indok=True)

        self.start_dt = timezone.make_aware(
            datetime.combine((timezone.now() + timedelta(days=14)).date(), time(hour=10, minute=0))
        )
        self.end_dt = self.start_dt + timedelta(hours=2)

    def add_booking_permission(self, user):
        content_type = ContentType.objects.get_for_model(JanHusBooking)
        user.user_permissions.add(Permission.objects.get(codename="manage_booking", content_type=content_type))


class JanHusMutationsTestCase(JanHusBaseTestCase):
    def test_create_booking_request_anonymous(self):
        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: \"{self.start_dt.isoformat()}\"
                  endsAt: \"{self.end_dt.isoformat()}\"
                  area: \"FIRST_FLOOR\"
                  requesterName: \"External User\"
                  requesterEmail: \"external@example.com\"
                  requesterPhone: \"41234567\"
                  responsibleName: \"Responsible User\"
                  responsibleEmail: \"responsible@example.com\"
                  responsiblePhone: \"41234567\"
                  eventType: \"EXTERNAL\"
                  cleaningRequested: true
                  comment: \"Need cleaning\"
                }}
              ) {{
                ok
                bookingRequest {{
                  id
                  status
                }}
              }}
            }}
        """

        response = self.query(query)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)
        self.assertTrue(content["data"]["createJanhusBookingRequest"]["ok"])
        self.assertEqual(1, JanHusBookingRequest.objects.count())
        self.assertEqual(JanHusBookingRequest.RequestStatus.PENDING, JanHusBookingRequest.objects.first().status)

    def test_create_booking_and_block_overlap(self):
        create_booking_query = f"""
            mutation {{
              createJanhusBooking(
                bookingData: {{
                  startsAt: \"{self.start_dt.isoformat()}\"
                  endsAt: \"{self.end_dt.isoformat()}\"
                  area: \"ENTIRE_HOUSE\"
                  responsibleName: \"Test User\"
                  responsibleEmail: \"test.user@example.com\"
                  responsiblePhone: \"41234567\"
                  eventType: \"PRIVATE\"
                  cleaningRequested: false
                  comment: \"Test booking\"
                }}
              ) {{
                ok
                booking {{
                  id
                  status
                }}
              }}
            }}
        """

        response = self.query(create_booking_query, user=self.user)
        self.assertResponseNoErrors(response)

        booking = JanHusBooking.objects.first()
        self.assertIsNotNone(booking)
        self.assertEqual(JanHusBookingStatus.CONFIRMED, booking.status)
        self.assertEqual(self.user.id, booking.owner_user_id)

        overlap_query = f"""
            mutation {{
              createJanhusBooking(
                bookingData: {{
                  startsAt: \"{self.start_dt.isoformat()}\"
                  endsAt: \"{self.end_dt.isoformat()}\"
                  area: \"FIRST_FLOOR\"
                  responsibleName: \"Other User\"
                  responsibleEmail: \"other.user@example.com\"
                  responsiblePhone: \"42222222\"
                  eventType: \"PRIVATE\"
                }}
              ) {{
                ok
                booking {{
                  id
                }}
              }}
            }}
        """

        overlap_response = self.query(overlap_query, user=self.other_user)
        self.assertResponseHasErrors(overlap_response)

    def test_create_booking_request_rejects_multi_day_window(self):
        JanHusBookingSettings.objects.create(
            min_duration_minutes=60,
            slot_granularity_minutes=30,
            opening_hour=0,
            closing_hour=0,
        )

        too_long_end = self.start_dt + timedelta(hours=26)

        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: \"{self.start_dt.isoformat()}\"
                  endsAt: \"{too_long_end.isoformat()}\"
                  area: \"FIRST_FLOOR\"
                  requesterName: \"Internal User\"
                  requesterEmail: \"internal@example.com\"
                  requesterPhone: \"41234567\"
                  responsibleName: \"Responsible User\"
                  responsibleEmail: \"responsible@example.com\"
                  responsiblePhone: \"41234567\"
                  eventType: \"INTERNAL\"
                }}
              ) {{
                ok
                bookingRequest {{
                  id
                }}
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseHasErrors(response)

        content = json.loads(response.content)
        self.assertIn("single booking day window", content["errors"][0]["message"])


class JanHusResolversTestCase(JanHusBaseTestCase):
    def test_admin_query_requires_permission(self):
        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area="FIRST_FLOOR",
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
        )

        query = """
            query {
              adminJanhusBookings {
                id
              }
            }
        """

        denied_response = self.query(query, user=self.user)
        self.assert_permission_error(denied_response)

        self.add_booking_permission(self.user)
        allowed_response = self.query(query, user=self.user)
        self.assertResponseNoErrors(allowed_response)

        content = json.loads(allowed_response.content)
        ids = [item["id"] for item in content["data"]["adminJanhusBookings"]]
        self.assertIn(str(booking.id), ids)


class JanHusMailTestCase(TestCase):
    def test_pending_review_notification_includes_booker_and_responsible(self):
        start_dt = timezone.make_aware(datetime.combine((timezone.now() + timedelta(days=7)).date(), time(12, 0)))
        booking = JanHusBooking.objects.create(
            starts_at=start_dt,
            ends_at=start_dt + timedelta(hours=1),
            area="FIRST_FLOOR",
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            booker_email="booker@example.com",
        )

        with patch("apps.janhus.mail.send_mail") as mocked_send_mail:
            send_pending_review_notification([booking])

        mocked_send_mail.assert_called_once()
        recipient_list = mocked_send_mail.call_args.kwargs["recipient_list"]
        self.assertCountEqual(["responsible@example.com", "booker@example.com"], recipient_list)
