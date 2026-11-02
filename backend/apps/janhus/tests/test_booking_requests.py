import json
from datetime import datetime, time, timedelta
from unittest.mock import patch

from django.utils import timezone

from apps.janhus.mutations import _ensure_personal_booking_allowed
from apps.janhus.models import JanHusBooking, JanHusBookingRequest, JanHusBookingSettings, JanHusBookingStatus
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory
from apps.janhus.tests.base import JanHusBaseTestCase


class JanHusBookingRequestMutationsTestCase(JanHusBaseTestCase):
    def test_personal_booking_guard_allows_exempt_booking_types(self):
        settings = JanHusBookingSettings(private_bookings_enabled=False)
        # Returning without an exception is the assertion: organization and external bookings are exempt.
        _ensure_personal_booking_allowed(
            actor=self.user,
            owner_organization=OrganizationFactory(),
            is_external_booking=False,
            settings=settings,
        )
        _ensure_personal_booking_allowed(
            actor=self.user,
            owner_organization=None,
            is_external_booking=True,
            settings=settings,
        )

    def test_create_booking_request_anonymous(self):
        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: \"{self.start_dt.isoformat()}\"
                  endsAt: \"{self.end_dt.isoformat()}\"
                  area: \"{self.first_floor_area.id}\"
                  requesterName: \"External User\"
                  requesterEmail: \"external@example.com\"
                  requesterPhone: \"41234567\"
                  occasion: \"Bursdag\" responsibleName: \"Responsible User\"
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
        self.assertEqual(
            JanHusBookingRequest.RequestStatus.PENDING,
            JanHusBookingRequest.objects.first().status,
        )

    def test_non_indok_user_cannot_create_non_external_booking_request(self):
        non_indok_user = UserFactory(is_indok=False)

        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  requesterName: "Non Indok User"
                  requesterEmail: "non-indok@example.com"
                  requesterPhone: "41234567"
                  occasion: "Bursdag" responsibleName: "Responsible User"
                  responsibleEmail: "responsible@example.com"
                  responsiblePhone: "41234567"
                  eventType: "INTERNAL"
                }}
              ) {{
                ok
                bookingRequest {{
                  id
                }}
              }}
            }}
        """

        response = self.query(query, user=non_indok_user)
        self.assertResponseHasErrors(response)

        content = json.loads(response.content)
        self.assertIn("Only Indøk students", content["errors"][0]["message"])

    def test_non_indok_user_can_create_external_booking_request(self):
        non_indok_user = UserFactory(is_indok=False)

        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  requesterName: "Non Indok User"
                  requesterEmail: "non-indok@example.com"
                  requesterPhone: "41234567"
                  occasion: "Bursdag" responsibleName: "Responsible User"
                  responsibleEmail: "responsible@example.com"
                  responsiblePhone: "41234567"
                  eventType: "EXTERNAL"
                }}
              ) {{
                ok
                bookingRequest {{
                  id
                  eventType
                }}
              }}
            }}
        """

        response = self.query(query, user=non_indok_user)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)
        self.assertEqual(
            "EXTERNAL",
            content["data"]["createJanhusBookingRequest"]["bookingRequest"]["eventType"],
        )

    def test_create_booking_request_rejects_private_event_type_when_disabled(self):
        JanHusBookingSettings.objects.create(private_bookings_enabled=False)

        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  requesterName: "Indok User"
                  requesterEmail: "indok@example.com"
                  requesterPhone: "41234567"
                  occasion: "Bursdag" responsibleName: "Indok User"
                  responsibleEmail: "indok@example.com"
                  responsiblePhone: "41234567"
                  eventType: "PRIVATE"
                }}
              ) {{
                ok
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseHasErrors(response)

        content = json.loads(response.content)
        self.assertIn("Private JanHus-bookinger er midlertidig deaktivert", content["errors"][0]["message"])
        self.assertFalse(JanHusBookingRequest.objects.exists())

    def test_with_private_bookings_off_organisation_leaders_book_for_the_organisation(self):
        JanHusBookingSettings.objects.create(private_bookings_enabled=False)
        organization = OrganizationFactory()
        MembershipFactory(organization=organization, user=self.user, group=organization.hr_group)

        def request(user, *, for_organization, days):
            owner = f'ownerOrganizationId: "{organization.id}"' if for_organization else ""
            return self.query(
                f"""
                mutation {{
                  createJanhusBookingRequest(requestData: {{
                    startsAt: "{(self.start_dt + timedelta(days=days)).isoformat()}"
                    endsAt: "{(self.end_dt + timedelta(days=days)).isoformat()}"
                    area: "{self.first_floor_area.id}"
                    {owner}
                    occasion: "Bursdag" responsibleName: "Ola" responsibleEmail: "ola@example.com" responsiblePhone: "41234567"
                    eventType: "INTERNAL"
                  }}) {{ ok }}
                }}
                """,
                user=user,
            )

        personal = request(self.user, for_organization=False, days=0)
        self.assertResponseHasErrors(personal)
        self.assertIn("Book på vegne av foreningen din", json.loads(personal.content)["errors"][0]["message"])
        self.assertResponseNoErrors(request(self.user, for_organization=True, days=1))
        self.assertResponseNoErrors(request(self.other_user, for_organization=False, days=2))

        direct = self.query(
            f"""
            mutation {{
              createJanhusBooking(bookingData: {{
                startsAt: "{(self.start_dt + timedelta(days=3)).isoformat()}"
                endsAt: "{(self.end_dt + timedelta(days=3)).isoformat()}"
                area: "{self.first_floor_area.id}"
                occasion: "Bursdag" responsibleName: "Ola" responsibleEmail: "ola@example.com" responsiblePhone: "41234567"
                eventType: "INTERNAL"
              }}) {{ ok }}
            }}
            """,
            user=self.user,
        )
        # and a booking made directly is for JanHus admins only
        self.assertResponseHasErrors(direct)
        self.assertIn("JanHus booking admin permission required", json.loads(direct.content)["errors"][0]["message"])

    def test_with_private_bookings_off_janhus_admins_may_still_book_personally(self):
        JanHusBookingSettings.objects.create(private_bookings_enabled=False)
        organization = OrganizationFactory()
        # A leader without the permission is refused a personal booking, so the exemption lets this through.
        MembershipFactory(organization=organization, user=self.user, group=organization.hr_group)
        self.add_booking_permission(self.user)

        response = self.query(
            f"""
            mutation {{
              createJanhusBookingRequest(requestData: {{
                startsAt: "{self.start_dt.isoformat()}"
                endsAt: "{self.end_dt.isoformat()}"
                area: "{self.first_floor_area.id}"
                occasion: "Bursdag" responsibleName: "Ola" responsibleEmail: "ola@example.com" responsiblePhone: "41234567"
                eventType: "INTERNAL"
              }}) {{ ok }}
            }}
            """,
            user=self.user,
        )

        self.assertResponseNoErrors(response)
        self.assertEqual(1, JanHusBookingRequest.objects.count())

    def test_create_booking_request_rejects_external_event_type_when_disabled(self):
        JanHusBookingSettings.objects.create(external_bookings_enabled=False)

        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: \"{self.start_dt.isoformat()}\"
                  endsAt: \"{self.end_dt.isoformat()}\"
                  area: \"{self.first_floor_area.id}\"
                  requesterName: \"External User\"
                  requesterEmail: \"external@example.com\"
                  requesterPhone: \"41234567\"
                  occasion: \"Bursdag\" responsibleName: \"Responsible User\"
                  responsibleEmail: \"responsible@example.com\"
                  responsiblePhone: \"41234567\"
                  eventType: \"EXTERNAL\"
                }}
              ) {{
                ok
                bookingRequest {{
                  id
                }}
              }}
            }}
        """

        response = self.query(query)
        self.assertResponseHasErrors(response)

        content = json.loads(response.content)
        self.assertIn("Eksterne JanHus-bookinger er midlertidig deaktivert", content["errors"][0]["message"])

    def test_an_approved_request_keeps_when_it_was_sent_and_the_messages(self):
        self.add_booking_permission(self.user)
        booking_request = JanHusBookingRequest.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            requester_user=self.other_user,
            requester_name="Kari Nordmann",
            requester_email="kari@example.com",
            requester_phone="41234567",
            responsible_name="Ola Nordmann",
            responsible_email="ola@example.com",
            responsible_phone="41234567",
            admin_comment="Intern merknad",
        )
        query = f"""
            mutation {{
              reviewJanhusBookingRequest(
                reviewData: {{
                  id: "{booking_request.id}" status: "APPROVED" convertToBooking: true bookerMessage: "Velkommen!"
                }}
              ) {{ booking {{ id }} }}
            }}
        """
        self.assertResponseNoErrors(self.query(query, user=self.user))

        booking = JanHusBooking.objects.get()
        self.assertEqual(booking_request.created_at, booking.requested_at)
        self.assertEqual("Velkommen!", booking.booker_message)
        self.assertEqual("Intern merknad", booking.admin_comment)

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
                  area: \"{self.first_floor_area.id}\"
                  requesterName: \"Internal User\"
                  requesterEmail: \"internal@example.com\"
                  requesterPhone: \"41234567\"
                  occasion: \"Bursdag\" responsibleName: \"Responsible User\"
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

    def test_create_booking_request_rejects_outside_active_booking_semesters(self):
        JanHusBookingSettings.objects.create(
            min_duration_minutes=60,
            slot_granularity_minutes=30,
            opening_hour=8,
            closing_hour=2,
            fall_start_date=(timezone.now() + timedelta(days=60)).date(),
            fall_end_date=(timezone.now() + timedelta(days=90)).date(),
            spring_start_date=(timezone.now() + timedelta(days=120)).date(),
            spring_end_date=(timezone.now() + timedelta(days=160)).date(),
            fall_semester_active=True,
            spring_semester_active=False,
        )

        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: \"{self.start_dt.isoformat()}\"
                  endsAt: \"{self.end_dt.isoformat()}\"
                  area: \"{self.first_floor_area.id}\"
                  requesterName: \"Internal User\"
                  requesterEmail: \"internal@example.com\"
                  requesterPhone: \"41234567\"
                  occasion: \"Bursdag\" responsibleName: \"Responsible User\"
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
        self.assertIn("outside of active booking semesters", content["errors"][0]["message"])

    def test_a_request_too_far_ahead_is_refused_when_it_is_sent(self):
        starts_at = timezone.make_aware(datetime.combine(timezone.localdate() + timedelta(days=35), time(10, 0)))

        def request(event_type):
            return f"""
                mutation {{
                  createJanhusBookingRequest(
                    requestData: {{
                      startsAt: \"{starts_at.isoformat()}\"
                      endsAt: \"{(starts_at + timedelta(hours=2)).isoformat()}\"
                      area: \"{self.first_floor_area.id}\"
                      requesterName: \"Some User\"
                      requesterEmail: \"someone@example.com\"
                      requesterPhone: \"41234567\"
                      occasion: \"Bursdag\" responsibleName: \"Responsible User\"
                      responsibleEmail: \"responsible@example.com\"
                      responsiblePhone: \"41234567\"
                      eventType: \"{event_type}\"
                    }}
                  ) {{
                    ok
                  }}
                }}
            """

        # a personal request from a member, and an external one without a login: the same window
        for label, event_type, user in [("personal", "INTERNAL", self.user), ("external", "EXTERNAL", None)]:
            with self.subTest(case=label):
                self.client.logout()
                response = self.query(request(event_type), user=user)
                self.assertResponseHasErrors(response)
                message = json.loads(response.content)["errors"][0]["message"]
                self.assertIn("Bookings can be made at most 4 weeks ahead", message)
        self.assertFalse(JanHusBookingRequest.objects.exists())

    def test_an_admin_may_approve_a_request_beyond_the_window(self):
        self.add_booking_permission(self.user)
        starts_at = timezone.make_aware(datetime.combine(timezone.localdate() + timedelta(days=70), time(10, 0)))
        booking_request = JanHusBookingRequest.objects.create(
            starts_at=starts_at,
            ends_at=starts_at + timedelta(hours=2),
            area=self.first_floor_area,
            requester_user=self.other_user,
            responsible_name="Other User",
            responsible_email="other.user@example.com",
            responsible_phone="42222222",
        )

        response = self.query(
            f"""
            mutation {{
              reviewJanhusBookingRequest(
                reviewData: {{ id: \"{booking_request.id}\" status: \"APPROVED\" convertToBooking: true }}
              ) {{
                ok
                booking {{
                  status
                }}
              }}
            }}
            """,
            user=self.user,
        )
        self.assertResponseNoErrors(response)
        booking = json.loads(response.content)["data"]["reviewJanhusBookingRequest"]["booking"]
        self.assertEqual(JanHusBookingStatus.PENDING_ADMIN_REVIEW, booking["status"])  # waits for payment

    def _org_booking_request_query(self, organization):
        return f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  ownerOrganizationId: "{organization.id}"
                  requesterName: "Requester"
                  requesterEmail: "requester@example.com"
                  requesterPhone: "41234567"
                  occasion: "Bursdag" responsibleName: "Responsible User"
                  responsibleEmail: "responsible@example.com"
                  responsiblePhone: "41234567"
                }}
              ) {{
                ok
                bookingRequest {{
                  id
                }}
              }}
            }}
        """

    def test_booking_for_an_organization_requires_leadership_or_admin_rights(self):
        organization = OrganizationFactory()

        outsider = UserFactory(is_indok=True)
        plain_member = UserFactory(is_indok=True)
        MembershipFactory(organization=organization, user=plain_member, group=None)
        leader = UserFactory(is_indok=True)
        MembershipFactory(organization=organization, user=leader, group=organization.hr_group)
        admin = UserFactory(is_indok=True)
        self.add_booking_permission(admin)

        cases = [
            ("outsider", outsider, False),
            ("member without HR", plain_member, False),
            ("HR leader", leader, True),
            ("JanHus admin", admin, True),
        ]

        for label, user, allowed in cases:
            with self.subTest(case=label):
                JanHusBookingRequest.objects.all().delete()
                response = self.query(self._org_booking_request_query(organization), user=user)
                if allowed:
                    self.assertResponseNoErrors(response)
                else:
                    self.assertResponseHasErrors(response)
                self.assertEqual(
                    allowed,
                    JanHusBookingRequest.objects.filter(owner_organization=organization).exists(),
                )

    def test_create_booking_request_rejects_organization_member_without_hr_group(self):
        organization = OrganizationFactory()
        plain_member = UserFactory(is_indok=True)
        MembershipFactory(organization=organization, user=plain_member, group=None)

        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  ownerOrganizationId: "{organization.id}"
                  requesterName: "Indok User"
                  requesterEmail: "indok@example.com"
                  requesterPhone: "41234567"
                  occasion: "Bursdag" responsibleName: "Responsible User"
                  responsibleEmail: "responsible@example.com"
                  responsiblePhone: "41234567"
                }}
              ) {{
                ok
              }}
            }}
        """

        response = self.query(query, user=plain_member)

        self.assertResponseHasErrors(response)
        self.assertFalse(JanHusBookingRequest.objects.filter(owner_organization=organization).exists())

    def test_create_booking_request_rejects_cleaning_when_option_disabled(self):
        JanHusBookingSettings.objects.create(cleaning_option_enabled=False)

        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  requesterName: "Requester"
                  requesterEmail: "requester@example.com"
                  requesterPhone: "41234567"
                  occasion: "Bursdag" responsibleName: "Responsible User"
                  responsibleEmail: "responsible@example.com"
                  responsiblePhone: "41234567"
                  cleaningRequested: true
                }}
              ) {{
                ok
              }}
            }}
        """

        response = self.query(query, user=self.user)

        self.assertResponseHasErrors(response)
        self.assertFalse(JanHusBookingRequest.objects.exists())

    def test_invalid_email_returns_readable_validation_error(self):
        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  requesterName: "Requester"
                  requesterEmail: "not-an-email"
                  requesterPhone: "41234567"
                  occasion: "Bursdag" responsibleName: "Responsible User"
                  responsibleEmail: "responsible@example.com"
                  responsiblePhone: "41234567"
                }}
              ) {{
                ok
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseHasErrors(response)

        content = json.loads(response.content)
        message = content["errors"][0]["message"]

        self.assertEqual("E-post bestiller: Ugyldig e-postadresse.", message)
        self.assertNotIn("requester_email", message)
        self.assertNotIn("{", message)

    def test_rejecting_a_request_mails_the_requester_but_approving_does_not(self):
        self.add_booking_permission(self.user)

        for status, expected in [("REJECTED", True), ("APPROVED", False)]:
            with self.subTest(status=status):
                booking_request = JanHusBookingRequest.objects.create(
                    starts_at=self.start_dt,
                    ends_at=self.end_dt,
                    area=self.first_floor_area,
                    requester_user=self.other_user,
                    requester_email="kari@example.com",
                    responsible_name="Ola",
                    responsible_email="ola@example.com",
                    responsible_phone="41234567",
                )
                query = f"""
                    mutation {{
                      reviewJanhusBookingRequest(
                        reviewData: {{ id: "{booking_request.id}" status: "{status}" }}
                      ) {{ ok }}
                    }}
                """
                with patch("apps.janhus.mutations.send_booking_request_rejected") as mocked_send:
                    response = self.query(query, user=self.user)
                self.assertResponseNoErrors(response)
                self.assertEqual(expected, mocked_send.called)

    def test_submitting_a_request_sends_the_receipt_mail(self):
        query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  requesterName: "Kari"
                  requesterEmail: "kari@example.com"
                  requesterPhone: "41234567"
                  occasion: "Bursdag" responsibleName: "Ola"
                  responsibleEmail: "ola@example.com"
                  responsiblePhone: "41234567"
                }}
              ) {{
                ok
              }}
            }}
        """

        with patch("apps.janhus.mutations.send_booking_request_received") as mocked_send:
            response = self.query(query, user=self.user)

        self.assertResponseNoErrors(response)
        mocked_send.assert_called_once()
