import json
from datetime import timedelta
from types import SimpleNamespace

from django.contrib.auth.models import Permission
from django.test import TestCase

from apps.janhus.door_access import door_access_warnings, user_by_feide_email
from apps.janhus.models import JanHusBooking, JanHusBookingRequest, JanHusBookingStatus, JanHusOrganizationDoorAccess
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory
from apps.janhus.tests.base import JanHusBaseTestCase


class DoorAccessWarningTests(TestCase):
    def test_warnings_cover_unlinked_bookers_and_no_owner(self):
        self.assertIsNone(user_by_feide_email(" "))
        self.assertTrue(door_access_warnings(SimpleNamespace(is_external_booking=True)))

        organization = OrganizationFactory()
        booker_only = SimpleNamespace(
            is_external_booking=False,
            owner_organization_id=organization.id,
            organization_door_access=JanHusOrganizationDoorAccess.BOOKER_ONLY,
            booker_user_id=None,
        )
        self.assertTrue(door_access_warnings(booker_only))

        organization_without_leaders = SimpleNamespace(
            is_external_booking=False,
            owner_organization_id=organization.id,
            organization_door_access=JanHusOrganizationDoorAccess.LEADERS,
        )
        self.assertTrue(door_access_warnings(organization_without_leaders))

        ownerless = SimpleNamespace(is_external_booking=False, owner_organization_id=None, owner_user_id=None)
        self.assertTrue(door_access_warnings(ownerless))
        owner = SimpleNamespace(is_external_booking=False, owner_organization_id=None, owner_user_id=1)
        self.assertEqual(door_access_warnings(owner), [])


class JanHusDoorAccessFieldsTestCase(JanHusBaseTestCase):
    """
    Who opens the door for a booking (apps.arx reads these): the booker's account,
    "only the booker" for organisation bookings, and the responsible person.
    Only JanHus admins change them. The factories give every user the same email and
    Feide id, so the users here get their own.
    """

    def setUp(self) -> None:
        super().setUp()
        self.admin = UserFactory(is_indok=True, email="admin@example.com")
        self.add_booking_permission(self.admin)
        self.organization = OrganizationFactory()
        self.leader = UserFactory(is_indok=True, email="leder@example.com")
        MembershipFactory(organization=self.organization, user=self.leader, group=self.organization.hr_group)
        self.responsible = UserFactory(
            is_indok=True, first_name="Rita", last_name="Ansvarligsen", email="rita@example.com"
        )
        self.booking = self._booking(owner_organization=self.organization, booker_user=self.leader)

    def _booking(self, **fields):
        values = {
            "starts_at": self.start_dt,
            "ends_at": self.end_dt,
            "area": self.first_floor_area,
            "responsible_name": "Rita Ansvarligsen",
            "responsible_email": "rita@example.com",
            "responsible_phone": "41234567",
            "status": JanHusBookingStatus.CONFIRMED,
        }
        values.update(fields)
        return JanHusBooking.objects.create(**values)

    def _update(self, user, fields):
        return self.query(
            f'mutation {{ updateJanhusBooking(bookingData: {{ id: "{self.booking.id}" {fields} }}) {{ ok }} }}',
            user=user,
        )

    def test_an_approved_request_keeps_the_requester_as_booker(self):
        request = JanHusBookingRequest.objects.create(
            starts_at=self.start_dt + timedelta(days=2),
            ends_at=self.end_dt + timedelta(days=2),
            area=self.first_floor_area,
            requester_user=self.leader,
            owner_organization=self.organization,
            requester_name="Leder",
            requester_email="leder@example.com",
            requester_phone="41234567",
            responsible_name="Rita Ansvarligsen",
            responsible_email="rita@example.com",
            responsible_phone="41234567",
        )
        response = self.query(
            f'mutation {{ reviewJanhusBookingRequest(reviewData: {{ id: "{request.id}" status: "APPROVED" '
            "convertToBooking: true }) { booking { id } } }",
            user=self.admin,
        )
        self.assertResponseNoErrors(response)
        booking_id = json.loads(response.content)["data"]["reviewJanhusBookingRequest"]["booking"]["id"]
        booking = JanHusBooking.objects.get(pk=booking_id)
        self.assertEqual(booking.booker_user, self.leader)  # not the admin who approved it
        self.assertEqual(booking.created_by_user, self.admin)

    def test_admin_sets_booker_only_and_the_responsible_person(self):
        response = self._update(
            self.admin,
            f'organizationDoorAccess: "BOOKER_ONLY" responsibleUser: "{self.responsible.id}" '
            'doorAccessPolicy: "BOOKER_AND_RESPONSIBLE"',
        )
        self.assertResponseNoErrors(response)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.organization_door_access, "BOOKER_ONLY")
        self.assertEqual(self.booking.responsible_user, self.responsible)
        self.assertEqual(self.booking.door_access_policy, "BOOKER_AND_RESPONSIBLE")

        response = self._update(self.admin, 'responsibleUser: "" doorAccessPolicy: "BOOKER_ONLY"')
        self.assertResponseNoErrors(response)
        self.booking.refresh_from_db()
        self.assertIsNone(self.booking.responsible_user)
        self.assertEqual(self.booking.door_access_policy, "BOOKER_ONLY")

    def test_door_access_needs_website_users(self):
        cases = {
            "responsible access without a responsible user": 'doorAccessPolicy: "BOOKER_AND_RESPONSIBLE"',
            "unknown user": 'responsibleUser: "999999"',
            "unknown choice": 'organizationDoorAccess: "EVERYONE"',
        }
        for name, fields in cases.items():
            with self.subTest(name):
                self.assertResponseHasErrors(self._update(self.admin, fields))
        self.booking.booker_user = None
        self.booking.save()
        with self.subTest("booker only without a booker account"):
            self.assertResponseHasErrors(self._update(self.admin, 'organizationDoorAccess: "BOOKER_ONLY"'))
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.organization_door_access, "LEADERS")
        self.assertEqual(self.booking.door_access_policy, "BOOKER_ONLY")

    def test_only_janhus_admins_change_door_access(self):
        viewer = UserFactory(is_indok=True, email="viewer@example.com")
        viewer.user_permissions.add(Permission.objects.get(codename="view_all_bookings"))
        attempts = {
            "booker only": 'organizationDoorAccess: "BOOKER_ONLY"',
            "responsible user": f'responsibleUser: "{self.leader.id}"',
            "booker and responsible": 'doorAccessPolicy: "BOOKER_AND_RESPONSIBLE"',
            "booker": f'bookerUser: "{self.responsible.id}"',
        }
        for user, who in ((self.leader, "organisation leader"), (viewer, "read-only viewer")):
            for name, fields in attempts.items():
                with self.subTest(f"{who}: {name}"):
                    self.assertResponseHasErrors(self._update(user, fields))
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.organization_door_access, "LEADERS")
        self.assertEqual(self.booking.booker_user, self.leader)
        self.assertIsNone(self.booking.responsible_user)

    def test_user_search_is_for_janhus_admins_and_finds_active_users(self):
        UserFactory(is_indok=True, first_name="Rita", last_name="Ansvarligsen", is_active=False)
        query = 'query { janhusUserSearch(query: "Ansvarligsen") { id displayName email } }'
        response = self.query(query, user=self.admin)
        self.assertResponseNoErrors(response)
        found = json.loads(response.content)["data"]["janhusUserSearch"]
        self.assertEqual(
            found, [{"id": str(self.responsible.id), "displayName": "Rita Ansvarligsen", "email": "rita@example.com"}]
        )
        self.assert_permission_error(self.query(query, user=self.leader))

    def test_who_booked_is_not_public(self):
        for field in ("createdByUser { id }", "bookerUser { id }", "responsibleUser { id }"):
            with self.subTest(field):
                query = f"query {{ janhusBookings {{ id {field} }} }}"
                self.client.logout()
                self.assertResponseHasErrors(self.query(query))
                self.assertResponseHasErrors(self.query(query, user=self.other_user))
                self.assertResponseNoErrors(self.query(query, user=self.admin))

    def test_admin_list_costs_the_same_for_more_bookings(self):
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        query = """
            query {
              adminJanhusBookings {
                id area { id } ownerUser { id } ownerOrganization { id }
                bookerUser { id } responsibleUser { id } guestListEntries { displayName }
                bookerEmail responsibleEmail doorAccessWarnings
              }
            }
        """

        def result_for_list():
            with CaptureQueriesContext(connection) as queries:
                response = self.query(query, user=self.admin)
                self.assertResponseNoErrors(response)
            bookings = json.loads(response.content)["data"]["adminJanhusBookings"]
            return len(queries), len(bookings)

        baseline_guest = UserFactory(feide_userid="baseline-guest", email="baseline-guest@example.com")
        self.booking.guest_list = json.dumps([baseline_guest.feide_userid])
        self.booking.save(update_fields=["guest_list"])
        result_for_list()  # warms caches that are filled once per test
        before_queries, before_bookings = result_for_list()
        for i in range(4):
            guest = UserFactory(feide_userid=f"guest-{i}", email=f"guest{i}@example.com")
            self._booking(
                owner_user=UserFactory(email=f"owner{i}@example.com"),
                booker_user=guest,
                responsible_user=self.responsible,
                starts_at=self.start_dt + timedelta(days=i + 3),
                ends_at=self.end_dt + timedelta(days=i + 3),
                guest_list=json.dumps([f"guest-{i}"]),
            )
        after_queries, after_bookings = result_for_list()
        self.assertEqual(after_queries, before_queries)
        self.assertEqual(after_bookings, before_bookings + 4)

    def test_existing_bookings_get_a_booker_when_it_is_unambiguous(self):
        import importlib

        from django.apps import apps as django_apps

        migration = importlib.import_module("apps.janhus.migrations.0022_door_access_fields")
        self.leader.feide_email = "leder@stud.ntnu.no"
        self.leader.save()
        self.responsible.feide_email = "rita@stud.ntnu.no"
        self.responsible.save()
        UserFactory(feide_email="dup@stud.ntnu.no")
        UserFactory(feide_email="dup@stud.ntnu.no")
        personal = self._booking(owner_user=self.other_user, responsible_email="RITA@stud.ntnu.no")
        matched = self._booking(owner_organization=self.organization, booker_email="LEDER@stud.ntnu.no")
        profile_email_only = self._booking(owner_organization=self.organization, booker_email="leder@example.com")
        ambiguous = self._booking(owner_organization=self.organization, booker_email="dup@stud.ntnu.no")
        unknown = self._booking(owner_organization=self.organization, booker_email="nobody@example.com")

        migration.fill_booker_user(django_apps, None)

        for booking, booker, responsible in (
            (personal, self.other_user, self.responsible),
            (matched, self.leader, None),
            (profile_email_only, None, None),  # only the Feide email counts
            (ambiguous, None, None),
            (unknown, None, None),
            (self.booking, self.leader, None),
        ):
            booking.refresh_from_db()
            self.assertEqual((booking.booker_user, booking.responsible_user), (booker, responsible))

    def test_the_responsible_person_is_found_by_feide_email(self):
        self.responsible.feide_email = "rita@stud.ntnu.no"
        self.responsible.save()
        request = JanHusBookingRequest.objects.create(
            starts_at=self.start_dt + timedelta(days=2),
            ends_at=self.end_dt + timedelta(days=2),
            area=self.first_floor_area,
            requester_user=self.leader,
            owner_organization=self.organization,
            requester_name="Leder",
            requester_email="leder@example.com",
            requester_phone="41234567",
            responsible_name="Rita Ansvarligsen",
            responsible_email="Rita@stud.ntnu.no",
            responsible_phone="41234567",
        )
        response = self.query(
            f'mutation {{ reviewJanhusBookingRequest(reviewData: {{ id: "{request.id}" status: "APPROVED" '
            "convertToBooking: true }) { booking { id } } }",
            user=self.admin,
        )
        self.assertResponseNoErrors(response)
        booking_id = json.loads(response.content)["data"]["reviewJanhusBookingRequest"]["booking"]["id"]
        self.assertEqual(JanHusBooking.objects.get(pk=booking_id).responsible_user, self.responsible)

    def test_an_owner_changing_the_responsible_email_relinks_the_person(self):
        self.booking.responsible_user = self.responsible
        self.booking.door_access_policy = "BOOKER_AND_RESPONSIBLE"
        self.booking.save()
        response = self._update(self.leader, 'responsibleEmail: "someone-else@example.com"')
        self.assertResponseNoErrors(response)
        self.booking.refresh_from_db()
        self.assertIsNone(self.booking.responsible_user)
        self.assertEqual(self.booking.door_access_policy, "BOOKER_ONLY")  # nobody left to include

    def test_admins_are_warned_when_the_booker_gets_no_door(self):
        query = "query { adminJanhusBookings { id doorAccessWarnings } }"

        def warnings_for(booking):
            response = self.query(query, user=self.admin)
            self.assertResponseNoErrors(response)
            rows = json.loads(response.content)["data"]["adminJanhusBookings"]
            return next(row["doorAccessWarnings"] for row in rows if row["id"] == str(booking.id))

        self.assertEqual(warnings_for(self.booking), [])  # the organisation has a leader
        no_leaders = self._booking(owner_organization=OrganizationFactory(), booker_user=self.leader)
        self.assertIn("ingen ledere", warnings_for(no_leaders)[0])
        no_leaders.organization_door_access = "BOOKER_ONLY"
        no_leaders.save()
        self.assertEqual(warnings_for(no_leaders), [])
        external = self._booking(is_external_booking=True)
        self.assertIn("eksternt kort", warnings_for(external)[0])
