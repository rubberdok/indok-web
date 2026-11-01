import json
from datetime import timedelta

from apps.janhus.models import JanHusBooking, JanHusBookingRequest, JanHusBookingStatus
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory
from apps.janhus.tests.base import JanHusBaseTestCase


class JanHusResolversTestCase(JanHusBaseTestCase):
    def test_admin_query_requires_permission(self):
        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
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

    def test_org_bookings_visible_only_for_org_leaders(self):
        organization = OrganizationFactory()
        leader_user = UserFactory(is_indok=True)
        member_user = UserFactory(is_indok=True)

        MembershipFactory(
            organization=organization,
            user=leader_user,
            group=organization.hr_group,
        )
        MembershipFactory(
            organization=organization,
            user=member_user,
            group=organization.primary_group,
        )

        org_booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_organization=organization,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
        )
        personal_booking = JanHusBooking.objects.create(
            starts_at=self.start_dt + timedelta(hours=4),
            ends_at=self.end_dt + timedelta(hours=4),
            area=self.second_floor_area,
            owner_user=member_user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
        )

        query = """
            query {
              janhusMyBookings {
                id
              }
            }
        """

        member_response = self.query(query, user=member_user)
        self.assertResponseNoErrors(member_response)
        member_ids = [item["id"] for item in json.loads(member_response.content)["data"]["janhusMyBookings"]]
        self.assertIn(str(personal_booking.id), member_ids)
        self.assertNotIn(str(org_booking.id), member_ids)

        leader_response = self.query(query, user=leader_user)
        self.assertResponseNoErrors(leader_response)
        leader_ids = [item["id"] for item in json.loads(leader_response.content)["data"]["janhusMyBookings"]]
        self.assertIn(str(org_booking.id), leader_ids)

    def test_my_bookings_include_booker_or_responsible_contacts(self):
        booker_booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            booker_name=f"{self.other_user.first_name} {self.other_user.last_name}",
            booker_email=self.other_user.email,
            booker_phone=str(self.other_user.phone_number),
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="40000000",
            status=JanHusBookingStatus.CONFIRMED,
        )
        responsible_booking = JanHusBooking.objects.create(
            starts_at=self.start_dt + timedelta(hours=4),
            ends_at=self.end_dt + timedelta(hours=4),
            area=self.second_floor_area,
            owner_user=self.user,
            booker_name="Booker",
            booker_email="booker@example.com",
            booker_phone="45555555",
            responsible_name=f"{self.other_user.first_name} {self.other_user.last_name}",
            responsible_email=self.other_user.email,
            responsible_phone=str(self.other_user.phone_number),
            status=JanHusBookingStatus.CONFIRMED,
        )

        query = """
            query {
              janhusMyBookings {
                id
              }
            }
        """

        response = self.query(query, user=self.other_user)
        self.assertResponseNoErrors(response)

        booking_ids = [item["id"] for item in json.loads(response.content)["data"]["janhusMyBookings"]]
        self.assertIn(str(booker_booking.id), booking_ids)
        self.assertIn(str(responsible_booking.id), booking_ids)

    def test_my_bookings_include_declined_so_the_owner_can_look_them_up(self):
        """A declined booking still has to be findable by the person who made it."""
        declined = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="40000000",
            status=JanHusBookingStatus.DECLINED,
        )

        response = self.query("{ janhusMyBookings { id status } }", user=self.user)
        self.assertResponseNoErrors(response)

        returned = json.loads(response.content)["data"]["janhusMyBookings"]
        self.assertIn(str(declined.id), [item["id"] for item in returned])

    def test_my_booking_requests_returns_only_the_users_own(self):
        mine = JanHusBookingRequest.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            requester_user=self.user,
            requester_name="Me",
            requester_email="me@example.com",
            requester_phone="41111111",
            responsible_name="Me",
            responsible_email="me@example.com",
            responsible_phone="41111111",
            status=JanHusBookingRequest.RequestStatus.REJECTED,
        )
        theirs = JanHusBookingRequest.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.second_floor_area,
            requester_user=self.other_user,
            requester_name="Someone else",
            requester_email="else@example.com",
            requester_phone="42222222",
            responsible_name="Someone else",
            responsible_email="else@example.com",
            responsible_phone="42222222",
        )

        query = "{ janhusMyBookingRequests { id status } }"
        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)

        ids = [item["id"] for item in json.loads(response.content)["data"]["janhusMyBookingRequests"]]
        self.assertIn(str(mine.id), ids)
        self.assertNotIn(str(theirs.id), ids)

    def test_my_booking_requests_is_empty_for_anonymous(self):
        response = self.query("{ janhusMyBookingRequests { id } }")
        self.assertResponseNoErrors(response)
        self.assertEqual([], json.loads(response.content)["data"]["janhusMyBookingRequests"])

    def test_guest_search_requires_access_and_returns_name_and_feide(self):
        searchable_user = UserFactory(
            is_indok=True,
            first_name="Siri",
            last_name="Nordmann",
            phone_number="43434343",
        )

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
        )

        query = f"""
            query {{
              janhusGuestSearch(bookingId: "{booking.id}", query: "4343") {{
                feideUserid
                displayName
              }}
            }}
        """

        denied_response = self.query(query, user=self.other_user)
        self.assertResponseHasErrors(denied_response)

        allowed_response = self.query(query, user=self.user)
        self.assertResponseNoErrors(allowed_response)

        results = json.loads(allowed_response.content)["data"]["janhusGuestSearch"]
        self.assertTrue(any(result["feideUserid"] == searchable_user.feide_userid for result in results))
        self.assertTrue(any(result["displayName"] == "Siri Nordmann" for result in results))

    def test_guest_search_for_request_requires_auth_and_returns_name_and_feide(self):
        searchable_user = UserFactory(
            is_indok=True,
            first_name="ReqSearchUnique",
            last_name="Nordmann",
            phone_number="45454545",
        )

        query = """
            query {
              janhusGuestSearchForRequest(query: "ReqSearchUnique") {
                feideUserid
                displayName
              }
            }
        """

        denied_response = self.query(query)
        self.assertResponseHasErrors(denied_response)

        allowed_response = self.query(query, user=self.user)
        self.assertResponseNoErrors(allowed_response)

        results = json.loads(allowed_response.content)["data"]["janhusGuestSearchForRequest"]
        self.assertTrue(any(result["feideUserid"] == searchable_user.feide_userid for result in results))
        self.assertTrue(any(result["displayName"] == "ReqSearchUnique Nordmann" for result in results))

    def test_bookable_organizations_returns_only_hr_organizations(self):
        lead_organization = OrganizationFactory(name="Leder i forening")
        member_organization = OrganizationFactory(name="Medlem i forening")
        unrelated_organization = OrganizationFactory(name="Uten tilknytning")

        MembershipFactory(
            organization=lead_organization,
            user=self.user,
            group=lead_organization.hr_group,
        )
        MembershipFactory(organization=member_organization, user=self.user, group=None)

        query = """
            query {
              janhusBookableOrganizations {
                id
                name
              }
            }
        """

        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)
        returned_ids = [organization["id"] for organization in content["data"]["janhusBookableOrganizations"]]

        self.assertEqual([str(lead_organization.id)], returned_ids)
        self.assertNotIn(str(member_organization.id), returned_ids)
        self.assertNotIn(str(unrelated_organization.id), returned_ids)

    def test_bookable_organizations_empty_for_anonymous_user(self):
        organization = OrganizationFactory()
        MembershipFactory(
            organization=organization,
            user=self.user,
            group=organization.hr_group,
        )

        query = """
            query {
              janhusBookableOrganizations {
                id
              }
            }
        """

        response = self.query(query)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)
        self.assertEqual([], content["data"]["janhusBookableOrganizations"])

    DETAILS_QUERY = """
        query {
          janhusBookings {
            id
            bookerEmail
            bookerPhone
            guestList
            guestListEntries { displayName }
            comment
            totalPrice
            outstandingDepositAmount
            doorAccessWarnings
          }
        }
    """

    AVAILABILITY_QUERY = """
        query {
          janhusBookings {
            id
            startsAt
            endsAt
            status
            area {
              id
              name
            }
          }
        }
    """

    def _booking_with_contact_details(self, **overrides):
        defaults = dict(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            booker_name="Booker",
            booker_email="booker@example.com",
            booker_phone="41234567",
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            guest_list='["Gjest Gjestesen"]',
            comment="Privat kommentar",
            status=JanHusBookingStatus.CONFIRMED,
        )
        defaults.update(overrides)
        return JanHusBooking.objects.create(**defaults)

    def test_contact_details_are_only_readable_by_connected_users(self):
        self._booking_with_contact_details()
        self.add_booking_permission(self.other_user)
        admin = type(self.other_user).objects.get(pk=self.other_user.pk)
        outsider = UserFactory(is_indok=True)

        # The anonymous case has to run first: self.query keeps the session.
        cases = [
            ("anonymous", None, False),
            ("unrelated", outsider, False),
            ("owner", self.user, True),
            ("admin", admin, True),
        ]

        for label, user, allowed in cases:
            with self.subTest(case=label):
                response = self.query(self.DETAILS_QUERY, user=user) if user else self.query(self.DETAILS_QUERY)
                if allowed:
                    self.assertResponseNoErrors(response)
                    content = json.loads(response.content)
                    self.assertEqual(
                        "booker@example.com",
                        content["data"]["janhusBookings"][0]["bookerEmail"],
                    )
                else:
                    self.assertResponseHasErrors(response)
                    body = response.content.decode()
                    self.assertNotIn("booker@example.com", body)
                    self.assertNotIn("Gjest Gjestesen", body)

    def test_availability_stays_readable_without_logging_in(self):
        booking = self._booking_with_contact_details()

        response = self.query(self.AVAILABILITY_QUERY)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)
        self.assertEqual(
            [str(booking.id)],
            [entry["id"] for entry in content["data"]["janhusBookings"]],
        )
        self.assertNotIn("booker@example.com", response.content.decode())

    CALENDAR_QUERY = """
        query {
          janhusBookings {
            id
            ownerDisplayName
          }
        }
    """

    def test_the_calendar_shows_who_has_the_booking_to_logged_in_users(self):
        self.user.first_name, self.user.last_name = "Ola", "Nordmann"
        self.user.save()
        organization = OrganizationFactory(name="Hyttestyret")
        personal = self._booking_with_contact_details()
        for_organization = self._booking_with_contact_details(
            owner_user=None,
            owner_organization=organization,
            starts_at=self.start_dt + timedelta(days=1),
            ends_at=self.end_dt + timedelta(days=1),
        )
        external = self._booking_with_contact_details(
            owner_user=None,
            is_external_booking=True,
            booker_name="Ekstern Person",
            starts_at=self.start_dt + timedelta(days=2),
            ends_at=self.end_dt + timedelta(days=2),
        )
        blocked = self._booking_with_contact_details(
            owner_user=None,
            status=JanHusBookingStatus.BLOCKED,
            starts_at=self.start_dt + timedelta(days=3),
            ends_at=self.end_dt + timedelta(days=3),
        )
        unowned = self._booking_with_contact_details(
            owner_user=None,
            starts_at=self.start_dt + timedelta(days=4),
            ends_at=self.end_dt + timedelta(days=4),
        )

        # anonymous first: self.query keeps the session
        anonymous = self.query(self.CALENDAR_QUERY)
        self.assertResponseNoErrors(anonymous)
        self.assertEqual(
            {None},
            {entry["ownerDisplayName"] for entry in json.loads(anonymous.content)["data"]["janhusBookings"]},
        )
        self.assertNotIn("Ekstern Person", anonymous.content.decode())

        response = self.query(self.CALENDAR_QUERY, user=UserFactory(is_indok=True))
        self.assertResponseNoErrors(response)
        bookings = json.loads(response.content)["data"]["janhusBookings"]
        names = {entry["id"]: entry["ownerDisplayName"] for entry in bookings}
        self.assertEqual(
            {
                str(personal.id): "Ola Nordmann",
                str(for_organization.id): "Hyttestyret",
                str(external.id): "Ekstern Person",
                str(blocked.id): "Stengt",
                str(unowned.id): "Booket",
            },
            names,
        )

    def test_the_calendar_costs_the_same_for_more_bookings(self):
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        viewer = UserFactory(is_indok=True)
        query = "query { janhusBookings { id ownerDisplayName area { id name } } }"

        def queries_for_calendar():
            with CaptureQueriesContext(connection) as queries:
                self.assertResponseNoErrors(self.query(query, user=viewer))
            return len(queries)

        self._booking_with_contact_details()
        queries_for_calendar()  # warms caches that are filled once per test
        before = queries_for_calendar()
        for i in range(3):
            self._booking_with_contact_details(
                owner_user=UserFactory(),
                starts_at=self.start_dt + timedelta(days=i + 1),
                ends_at=self.end_dt + timedelta(days=i + 1),
            )
            self._booking_with_contact_details(
                owner_user=None,
                owner_organization=OrganizationFactory(),
                starts_at=self.start_dt + timedelta(days=i + 5),
                ends_at=self.end_dt + timedelta(days=i + 5),
            )
        self.assertEqual(queries_for_calendar(), before)

    def test_the_internal_comment_is_for_admins_and_the_message_for_the_booker(self):
        self._booking_with_contact_details(admin_comment="Intern merknad", booker_message="Velkommen!")
        JanHusBookingRequest.objects.create(
            starts_at=self.start_dt + timedelta(days=1),
            ends_at=self.end_dt + timedelta(days=1),
            area=self.first_floor_area,
            requester_user=self.user,
            responsible_name="Ola",
            responsible_email="ola@example.com",
            responsible_phone="41234567",
            admin_comment="Intern om forespørselen",
            booker_message="Prøv en annen dag.",
        )
        admin = UserFactory(is_indok=True)
        self.add_booking_permission(admin)

        mine = self.query(
            "query { janhusMyBookings { bookerMessage } janhusMyBookingRequests { bookerMessage } }", user=self.user
        )
        self.assertResponseNoErrors(mine)
        data = json.loads(mine.content)["data"]
        self.assertEqual([{"bookerMessage": "Velkommen!"}], data["janhusMyBookings"])
        self.assertEqual([{"bookerMessage": "Prøv en annen dag."}], data["janhusMyBookingRequests"])
        for query in (
            "query { janhusMyBookings { adminComment } }",
            "query { janhusMyBookingRequests { adminComment } }",
        ):
            with self.subTest(query):
                response = self.query(query, user=self.user)
                self.assertResponseHasErrors(response)
                self.assertNotIn("Intern", response.content.decode())

        admin_view = self.query(
            "query { adminJanhusBookings { adminComment bookerMessage } janhusBookingRequests { adminComment } }",
            user=admin,
        )
        self.assertResponseNoErrors(admin_view)
        data = json.loads(admin_view.content)["data"]
        self.assertEqual(
            [{"adminComment": "Intern merknad", "bookerMessage": "Velkommen!"}], data["adminJanhusBookings"]
        )
        self.assertEqual([{"adminComment": "Intern om forespørselen"}], data["janhusBookingRequests"])
