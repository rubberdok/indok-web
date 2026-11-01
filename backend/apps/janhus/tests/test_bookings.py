import json
from datetime import timedelta
from unittest.mock import patch

from django.utils import timezone
from graphql import GraphQLError

from apps.janhus.mutations import _resolve_user_or_none
from apps.janhus.models import JanHusBooking, JanHusDepositStatus, JanHusBookingSettings, JanHusBookingStatus
from utils.testing.factories.users import UserFactory
from apps.janhus.tests.base import JanHusBaseTestCase


class JanHusBookingMutationsTestCase(JanHusBaseTestCase):
    def test_create_booking_rejects_unknown_organization_and_non_admins(self):
        JanHusBookingSettings.objects.create(private_bookings_enabled=True)
        base = f"""
            startsAt: "{self.start_dt.isoformat()}"
            endsAt: "{self.end_dt.isoformat()}"
            area: "{self.first_floor_area.id}"
            responsibleName: "Responsible"
            responsibleEmail: "responsible@example.com"
            responsiblePhone: "41234567"
        """
        self.add_booking_permission(self.user)
        unknown_organization = self.query(
            f"""
                mutation {{
                  createJanhusBooking(bookingData: {{ {base} ownerOrganizationId: "999999" }}) {{ ok }}
                }}
            """,
            user=self.user,
        )
        self.assertResponseHasErrors(unknown_organization)

        non_admin = self.query(
            f"""
                mutation {{
                  createJanhusBooking(bookingData: {{ {base} }}) {{ ok }}
                }}
            """,
            user=self.other_user,
        )
        self.assertResponseHasErrors(non_admin)

    def test_resolve_user_or_none_handles_empty_invalid_and_missing_ids(self):
        self.assertIsNone(_resolve_user_or_none(None))
        self.assertEqual(_resolve_user_or_none(self.user.pk), self.user)
        for user_id in ("not-an-id", "999999"):
            with self.subTest(user_id=user_id), self.assertRaises(GraphQLError):
                _resolve_user_or_none(user_id)

    def test_only_janhus_admins_may_create_a_booking_directly(self):
        # Everyone else sends a booking request, which a JanHus admin turns into a booking. The
        # request has the same rules (test_non_indok_user_cannot_create_non_external_booking_request).
        non_indok_user = UserFactory(is_indok=False)

        query = f"""
            mutation {{
              createJanhusBooking(
                bookingData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  responsibleName: "Non Indok User"
                  responsibleEmail: "non-indok@example.com"
                  responsiblePhone: "41234567"
                  eventType: "INTERNAL"
                }}
              ) {{
                ok
                booking {{
                  id
                }}
              }}
            }}
        """

        for label, user in [("not from Indøk", non_indok_user), ("from Indøk", self.user), ("not logged in", None)]:
            with self.subTest(label):
                self.client.logout()
                response = self.query(query, user=user)
                self.assertResponseHasErrors(response)
                content = json.loads(response.content)
                self.assertIn("JanHus booking admin permission required", content["errors"][0]["message"])
        self.assertFalse(JanHusBooking.objects.exists())

    def test_a_booking_made_directly_was_requested_when_it_was_made(self):
        self.add_booking_permission(self.user)
        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            responsible_name="Ola",
            responsible_email="ola@example.com",
            responsible_phone="41234567",
        )
        self.assertIsNone(booking.requested_at)  # only the mutations set it

        before = timezone.now()
        response = self.query(
            f"""
            mutation {{
              createJanhusBooking(bookingData: {{
                startsAt: "{(self.start_dt + timedelta(days=1)).isoformat()}"
                endsAt: "{(self.end_dt + timedelta(days=1)).isoformat()}"
                area: "{self.first_floor_area.id}"
                responsibleName: "Ola" responsibleEmail: "ola@example.com" responsiblePhone: "41234567"
              }}) {{ booking {{ id requestedAt }} }}
            }}
            """,
            user=self.user,
        )
        self.assertResponseNoErrors(response)
        created_id = json.loads(response.content)["data"]["createJanhusBooking"]["booking"]["id"]
        created = JanHusBooking.objects.get(pk=created_id)
        self.assertGreaterEqual(created.requested_at, before)

    def test_deleting_a_coming_booking_mails_the_booker(self):
        self.add_booking_permission(self.user)

        def booking(**overrides):
            defaults = dict(
                starts_at=self.start_dt,
                ends_at=self.end_dt,
                area=self.first_floor_area,
                owner_user=self.other_user,
                booker_email="booker@example.com",
                responsible_name="Ola",
                responsible_email="ola@example.com",
                responsible_phone="41234567",
                status=JanHusBookingStatus.CONFIRMED,
            )
            defaults.update(overrides)
            return JanHusBooking.objects.create(**defaults)

        past = timezone.now() - timedelta(days=2)
        tomorrow = timedelta(days=1)
        cases = [
            ("coming", booking(), True),
            (
                "waiting for payment",
                booking(
                    status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
                    starts_at=self.start_dt + 2 * tomorrow,
                    ends_at=self.end_dt + 2 * tomorrow,
                ),
                True,
            ),
            ("over", booking(starts_at=past, ends_at=past + timedelta(hours=2)), False),
            (
                "declined",
                booking(
                    status=JanHusBookingStatus.DECLINED,
                    starts_at=self.start_dt + tomorrow,
                    ends_at=self.end_dt + tomorrow,
                ),
                False,
            ),
        ]
        mutation = """
            mutation($id: ID!, $message: String) { deleteJanhusBooking(bookingId: $id, message: $message) { ok } }
        """
        for label, target, mailed in cases:
            with self.subTest(label):
                with patch("apps.janhus.mutations.send_booking_deleted") as sent:
                    response = self.query(
                        mutation, variables={"id": str(target.id), "message": " Huset er stengt. "}, user=self.user
                    )
                self.assertResponseNoErrors(response)
                self.assertFalse(JanHusBooking.objects.filter(pk=target.pk).exists())
                if mailed:
                    sent.assert_called_once()
                    self.assertEqual(target.reference, sent.call_args.args[0].reference)
                    self.assertEqual("Huset er stengt.", sent.call_args.kwargs["message"])
                else:
                    sent.assert_not_called()

    def test_an_admins_direct_booking_shows_what_it_overlaps(self):
        self.add_booking_permission(self.user)

        def create(area, responsible_email):
            return self.query(
                f"""
                mutation {{
                  createJanhusBooking(
                    bookingData: {{
                      startsAt: \"{self.start_dt.isoformat()}\"
                      endsAt: \"{self.end_dt.isoformat()}\"
                      area: \"{area.id}\"
                      responsibleName: \"Test User\"
                      responsibleEmail: \"{responsible_email}\"
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
                    overlappingBookings {{
                      id
                    }}
                  }}
                }}
                """,
                user=self.user,
            )

        response = create(self.entire_house_area, "test.user@example.com")
        self.assertResponseNoErrors(response)

        booking = JanHusBooking.objects.first()
        self.assertIsNotNone(booking)
        self.assertEqual(JanHusBookingStatus.PENDING_ADMIN_REVIEW, booking.status)
        self.assertEqual(self.user.id, booking.owner_user_id)

        # an admin may double-book on purpose; the answer says what it overlaps
        overlap_response = create(self.first_floor_area, "other.user@example.com")
        self.assertResponseNoErrors(overlap_response)
        overlapping = json.loads(overlap_response.content)["data"]["createJanhusBooking"]["overlappingBookings"]
        self.assertEqual([{"id": str(booking.id)}], overlapping)

    def test_booking_reference_is_unique_readable_and_stable(self):
        def make(offset, area, owner):
            return JanHusBooking.objects.create(
                starts_at=self.start_dt + timedelta(days=offset),
                ends_at=self.end_dt + timedelta(days=offset),
                area=area,
                owner_user=owner,
                responsible_name="Responsible",
                responsible_email="responsible@example.com",
                responsible_phone="41234567",
            )

        first = make(0, self.first_floor_area, self.user)
        second = make(1, self.second_floor_area, self.other_user)

        self.assertRegex(first.reference, r"^JH-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$")
        self.assertNotEqual(first.reference, second.reference)

        # Editing the booking must not change a reference the booker already has.
        original = first.reference
        first.starts_at = self.start_dt + timedelta(days=3)
        first.area = self.second_floor_area
        first.responsible_email = "someone-else@example.com"
        first.save()
        first.refresh_from_db()

        self.assertEqual(original, first.reference)

    def _review_to_confirmed_query(self, booking):
        return f"""
            mutation {{
              reviewJanhusBooking(
                reviewData: {{
                  id: "{booking.id}"
                  status: "CONFIRMED"
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

    def _review_booking_query(self, booking, status):
        return f"""
            mutation {{
              reviewJanhusBooking(
                reviewData: {{ id: "{booking.id}" status: "{status}" }}
              ) {{ ok }}
            }}
        """

    def _pending_booking(self, **overrides):
        defaults = dict(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.other_user,
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
            booker_email="booker@example.com",
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            manually_marked_as_paid=True,
        )
        defaults.update(overrides)
        return JanHusBooking.objects.create(**defaults)

    def test_reviewing_a_booking_sends_the_matching_mail_once(self):
        self.add_booking_permission(self.user)

        cases = [
            ("confirmed", JanHusBookingStatus.PENDING_ADMIN_REVIEW, "CONFIRMED", "send_booking_confirmation", True),
            ("declined", JanHusBookingStatus.PENDING_ADMIN_REVIEW, "DECLINED", "send_booking_declined", True),
            # Re-confirming an already confirmed booking must not mail again.
            ("already confirmed", JanHusBookingStatus.CONFIRMED, "CONFIRMED", "send_booking_confirmation", False),
        ]

        for label, initial, new_status, target, expected in cases:
            with self.subTest(case=label):
                booking = self._pending_booking(status=initial)
                with patch(f"apps.janhus.mutations.{target}") as mocked_send:
                    response = self.query(self._review_booking_query(booking, new_status), user=self.user)
                self.assertResponseNoErrors(response)
                self.assertEqual(expected, mocked_send.called)

    def test_booking_review_updates_the_booker_message_and_deposit_status(self):
        self.add_booking_permission(self.user)
        booking = self._pending_booking()
        response = self.query(
            f"""
                mutation {{
                  reviewJanhusBooking(
                    reviewData: {{
                      id: "{booking.id}"
                      status: "PENDING_ADMIN_REVIEW"
                      bookerMessage: "Nøkkelen ligger i resepsjonen."
                      depositStatus: "REQUESTED"
                    }}
                  ) {{ ok }}
                }}
            """,
            user=self.user,
        )
        self.assertResponseNoErrors(response)
        booking.refresh_from_db()
        self.assertEqual(booking.booker_message, "Nøkkelen ligger i resepsjonen.")
        self.assertEqual(booking.deposit_status, JanHusDepositStatus.REQUESTED)

        invalid = self.query(
            f"""
                mutation {{
                  reviewJanhusBooking(
                    reviewData: {{ id: "{booking.id}" status: "PENDING_ADMIN_REVIEW" depositStatus: "INVALID" }}
                  ) {{ ok }}
                }}
            """,
            user=self.user,
        )
        self.assertResponseHasErrors(invalid)
