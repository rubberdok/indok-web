import json
from datetime import timedelta
from types import SimpleNamespace

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase
from django.utils import timezone

from decorators import PermissionDenied
from apps.janhus.models import JanHusArea, JanHusBooking, JanHusBookingRequest, JanHusBookingStatus
from apps.janhus.permissions import (
    can_edit_guest_list,
    can_view_booking_details,
    has_manage_booking_permission,
    has_manage_settings_permission,
    has_view_all_bookings_permission,
    is_booking_owner,
    is_connected_to_booking,
    normalize_phone_number,
)
from apps.janhus.rules import get_or_create_settings
from apps.janhus.types import JanHusBookingType
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory
from apps.janhus.tests.base import JanHusBaseTestCase


class JanHusBookingFieldPermissionTestCase(JanHusBaseTestCase):
    def test_booking_detail_resolvers_reject_unconnected_users(self):
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
        info = SimpleNamespace(context=SimpleNamespace(user=UserFactory(is_indok=True)))
        resolvers = (
            JanHusBookingType.resolve_guest_list_entries,
            JanHusBookingType.resolve_door_access_warnings,
            JanHusBookingType.resolve_total_price,
            JanHusBookingType.resolve_outstanding_deposit_amount,
        )
        for resolver in resolvers:
            with self.subTest(resolver=resolver.__name__), self.assertRaises(PermissionDenied):
                resolver(booking, info)

    def test_unowned_calendar_booking_uses_a_generic_display_name(self):
        booking = SimpleNamespace(
            status=JanHusBookingStatus.CONFIRMED,
            owner_organization_id=None,
            owner_user_id=None,
            is_external_booking=False,
            booker_name="",
        )
        info = SimpleNamespace(context=SimpleNamespace(user=self.user))
        self.assertEqual(JanHusBookingType.resolve_owner_display_name(booking, info), "Booket")


class JanHusPermissionsTestCase(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory(is_indok=True)
        self.other_user = UserFactory(is_indok=True)
        self.area, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        self.starts_at = timezone.now() + timedelta(days=14)

    def _grant(self, user, codename):
        content_type = ContentType.objects.get_for_model(JanHusBooking)
        user.user_permissions.add(Permission.objects.get(codename=codename, content_type=content_type))
        return type(user).objects.get(pk=user.pk)

    def _booking(self, **overrides):
        defaults = dict(
            starts_at=self.starts_at,
            ends_at=self.starts_at + timedelta(hours=2),
            area=self.area,
            owner_user=self.user,
            booker_name="Booker",
            booker_email="booker@example.com",
            booker_phone="41234567",
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="49876543",
            status=JanHusBookingStatus.CONFIRMED,
        )
        defaults.update(overrides)
        return JanHusBooking.objects.create(**defaults)

    def test_booking_admins_also_get_settings_access_but_not_the_reverse(self):
        self.assertFalse(has_manage_booking_permission(self.user))
        self.assertFalse(has_manage_settings_permission(self.user))
        self.assertFalse(has_manage_booking_permission(None))

        booking_admin = self._grant(self.user, "manage_booking")
        self.assertTrue(has_manage_booking_permission(booking_admin))
        self.assertTrue(has_manage_settings_permission(booking_admin))

        settings_admin = self._grant(self.other_user, "manage_settings")
        self.assertTrue(has_manage_settings_permission(settings_admin))
        self.assertFalse(has_manage_booking_permission(settings_admin))

        self.assertTrue(has_manage_booking_permission(UserFactory(is_indok=True, is_superuser=True)))

    def test_phone_numbers_are_normalised(self):
        cases = [
            ("41234567", "41234567"),
            ("+47 41234567", "41234567"),
            ("0047 41234567", "41234567"),
            # A leading 47 is a country code only when more than 8 digits follow.
            ("47123456", "47123456"),
            ("", ""),
            (None, ""),
        ]
        for raw, expected in cases:
            with self.subTest(raw=raw):
                self.assertEqual(expected, normalize_phone_number(raw))

    def test_a_booking_is_owned_by_its_user_or_the_organization_leaders(self):
        organization = OrganizationFactory()
        leader = UserFactory(is_indok=True)
        member = UserFactory(is_indok=True)
        MembershipFactory(organization=organization, user=leader, group=organization.hr_group)
        MembershipFactory(organization=organization, user=member, group=None)

        personal = self._booking()
        self.assertTrue(is_booking_owner(self.user, personal))
        self.assertFalse(is_booking_owner(self.other_user, personal))
        self.assertFalse(is_booking_owner(None, personal))

        org_booking = self._booking(owner_user=None, owner_organization=organization)
        self.assertTrue(is_booking_owner(leader, org_booking))
        self.assertFalse(is_booking_owner(member, org_booking))

    def test_booking_details_are_visible_to_admins_owners_and_listed_contacts(self):
        booking = self._booking(owner_user=None, is_external_booking=True)

        # Every factory user shares a default phone, so give these distinct ones.
        by_email = UserFactory(is_indok=False, email="booker@example.com")
        by_phone = UserFactory(is_indok=False, email="unrelated@example.com", phone_number="45555555")
        stranger = UserFactory(is_indok=False, email="stranger@example.com", phone_number="46666666")
        admin = self._grant(self.user, "manage_booking")

        booking.booker_phone = "45555555"
        booking.save(update_fields=["booker_phone"])

        self.assertTrue(is_connected_to_booking(by_email, booking))
        self.assertTrue(is_connected_to_booking(by_phone, booking))
        self.assertTrue(is_connected_to_booking(admin, booking))
        self.assertFalse(is_connected_to_booking(stranger, booking))
        self.assertFalse(is_connected_to_booking(None, booking))


class JanHusViewAllBookingsPermissionTestCase(JanHusBaseTestCase):
    """
    janhus.view_all_bookings: everything the admin page shows, read-only.
    The viewer below is not connected to any booking, so whatever they can see
    or do comes from the permission alone.
    """

    def setUp(self) -> None:
        super().setUp()
        self.viewer = UserFactory(is_indok=True)
        self.viewer.user_permissions.add(
            Permission.objects.get(
                codename="view_all_bookings",
                content_type=ContentType.objects.get_for_model(JanHusBooking),
            )
        )
        self.booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.other_user,
            booker_email="booker@example.com",
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            admin_comment="Only for admins",
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
        )
        self.request = JanHusBookingRequest.objects.create(
            starts_at=self.start_dt + timedelta(days=1),
            ends_at=self.end_dt + timedelta(days=1),
            area=self.first_floor_area,
            requester_user=self.other_user,
            requester_email="kari@example.com",
            responsible_name="Kari",
            responsible_email="kari@example.com",
            responsible_phone="41234567",
        )

    def test_helpers_grant_viewing_and_nothing_else(self):
        self.assertTrue(has_view_all_bookings_permission(self.viewer))
        self.assertTrue(can_view_booking_details(self.viewer, self.booking))
        self.assertFalse(has_manage_booking_permission(self.viewer))
        self.assertFalse(has_manage_settings_permission(self.viewer))
        self.assertFalse(can_edit_guest_list(self.viewer, self.booking))
        self.assertFalse(is_connected_to_booking(self.viewer, self.booking))

    def test_viewer_sees_all_bookings_with_details_and_all_requests(self):
        bookings_response = self.query(
            """
            query {
              adminJanhusBookings { id bookerEmail adminComment totalPrice guestListEntries { displayName } }
            }
            """,
            user=self.viewer,
        )
        self.assertResponseNoErrors(bookings_response)
        bookings = json.loads(bookings_response.content)["data"]["adminJanhusBookings"]
        (booking,) = [b for b in bookings if b["id"] == str(self.booking.id)]
        self.assertEqual(booking["bookerEmail"], "booker@example.com")
        self.assertEqual(booking["adminComment"], "Only for admins")

        requests_response = self.query("query { janhusBookingRequests { id requesterEmail } }", user=self.viewer)
        self.assertResponseNoErrors(requests_response)
        requests = json.loads(requests_response.content)["data"]["janhusBookingRequests"]
        self.assertIn(str(self.request.id), [r["id"] for r in requests])

    def test_viewer_cannot_change_anything(self):
        def mutation(field, arguments, result="ok"):
            return f"mutation {{ {field}({arguments}) {{ {result} }} }}"

        booking_id, request_id = self.booking.id, self.request.id
        settings_before = get_or_create_settings().min_duration_minutes
        attempts = {
            "update booking": mutation(
                "updateJanhusBooking", f'bookingData: {{ id: "{booking_id}" status: "CANCELLED" }}'
            ),
            "review booking": mutation(
                "reviewJanhusBooking", f'reviewData: {{ id: "{booking_id}" status: "CONFIRMED" }}'
            ),
            "delete booking": mutation("deleteJanhusBooking", f'bookingId: "{booking_id}"'),
            "payment product": mutation("createJanhusPaymentProduct", f'bookingId: "{booking_id}"', "productId"),
            "review request": mutation(
                "reviewJanhusBookingRequest",
                f'reviewData: {{ id: "{request_id}" status: "APPROVED" convertToBooking: true }}',
            ),
            "delete request": mutation("deleteJanhusBookingRequest", f'requestId: "{request_id}"'),
            "settings": mutation("updateJanhusBookingSettings", "settingsData: { minDurationMinutes: 15 }"),
            "guest search": f'query {{ janhusGuestSearch(bookingId: "{booking_id}", query: "ab") {{ displayName }} }}',
        }
        for name, query in attempts.items():
            with self.subTest(name):
                response = self.query(query, user=self.viewer)
                self.assertResponseHasErrors(response)
                # refused for lack of permission, not because the query itself is wrong
                messages = " ".join(e["message"] for e in json.loads(response.content)["errors"])
                for invalid in ("Cannot query field", "Unknown argument", "Expected type"):
                    self.assertNotIn(invalid, messages)

        self.booking.refresh_from_db()
        self.request.refresh_from_db()
        self.assertEqual(self.booking.status, JanHusBookingStatus.PENDING_ADMIN_REVIEW)
        self.assertEqual(self.request.status, JanHusBookingRequest.RequestStatus.PENDING)
        self.assertEqual(get_or_create_settings().min_duration_minutes, settings_before)

    def test_without_the_permission_the_admin_queries_stay_closed(self):
        for query in ("query { adminJanhusBookings { id } }", "query { janhusBookingRequests { id } }"):
            with self.subTest(query):
                self.assert_permission_error(self.query(query, user=self.other_user))
