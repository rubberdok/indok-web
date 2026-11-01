import json
from unittest.mock import patch

from apps.janhus.guest_list import build_guest_list_entries
from apps.janhus.models import JanHusBooking, JanHusBookingStatus
from apps.janhus.resolvers import _search_users_for_booking
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory
from apps.janhus.tests.base import JanHusBaseTestCase


class JanHusGuestListMutationsTestCase(JanHusBaseTestCase):
    def test_empty_guest_list_skips_user_lookup(self):
        with patch("apps.janhus.guest_list._users_by_feide_id") as users:
            self.assertEqual(build_guest_list_entries(""), [])
        users.assert_not_called()

    def test_guest_user_search_handles_short_and_full_name_queries(self):
        user = UserFactory(first_name="Olav", last_name="Nordmann")
        self.assertEqual(_search_users_for_booking(" O "), [])
        results = _search_users_for_booking("Olav Nordmann")
        self.assertEqual([result["id"] for result in results], [user.id])

    def test_guest_list_is_preserved_when_request_is_converted(self):
        self.add_booking_permission(self.user)

        guest_list_value = "Ada Lovelace\nGrace Hopper"
        guest_list_literal = guest_list_value.replace("\n", "\\n")

        create_query = f"""
            mutation {{
              createJanhusBookingRequest(
                requestData: {{
                  startsAt: \"{self.start_dt.isoformat()}\"
                  endsAt: \"{self.end_dt.isoformat()}\"
                  area: \"{self.first_floor_area.id}\"
                  requesterName: \"Requester User\"
                  requesterEmail: \"requester@example.com\"
                  requesterPhone: \"41234567\"
                  responsibleName: \"Responsible User\"
                  responsibleEmail: \"responsible@example.com\"
                  responsiblePhone: \"41234567\"
                  eventType: \"INTERNAL\"
                  guestList: "{guest_list_literal}"
                }}
              ) {{
                ok
                bookingRequest {{
                  id
                  guestList
                }}
              }}
            }}
        """

        create_response = self.query(create_query, user=self.other_user)
        self.assertResponseNoErrors(create_response)

        create_content = json.loads(create_response.content)
        request_id = create_content["data"]["createJanhusBookingRequest"]["bookingRequest"]["id"]
        self.assertEqual(
            guest_list_value,
            create_content["data"]["createJanhusBookingRequest"]["bookingRequest"]["guestList"],
        )

        review_query = f"""
            mutation {{
              reviewJanhusBookingRequest(
                reviewData: {{
                  id: \"{request_id}\"
                  status: \"APPROVED\"
                  convertToBooking: true
                }}
              ) {{
                ok
                booking {{
                  id
                  status
                  guestList
                }}
              }}
            }}
        """

        review_response = self.query(review_query, user=self.user)
        self.assertResponseNoErrors(review_response)

        review_content = json.loads(review_response.content)
        self.assertEqual(
            guest_list_value,
            review_content["data"]["reviewJanhusBookingRequest"]["booking"]["guestList"],
        )
        self.assertEqual(
            JanHusBookingStatus.PENDING_ADMIN_REVIEW,
            review_content["data"]["reviewJanhusBookingRequest"]["booking"]["status"],
        )

        booking = JanHusBooking.objects.first()
        self.assertIsNotNone(booking)
        self.assertEqual(guest_list_value, booking.guest_list)
        self.assertEqual(JanHusBookingStatus.PENDING_ADMIN_REVIEW, booking.status)

    def test_update_booking_guest_list_access_and_policy_admin_only(self):
        guest_user = UserFactory(is_indok=True)
        booker_user = UserFactory(is_indok=True, phone_number="41111111")
        responsible_user = UserFactory(is_indok=True, phone_number="42222222")

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            booker_name=f"{booker_user.first_name} {booker_user.last_name}",
            booker_email=booker_user.email,
            booker_phone=str(booker_user.phone_number),
            responsible_name=f"{responsible_user.first_name} {responsible_user.last_name}",
            responsible_email=responsible_user.email,
            responsible_phone=str(responsible_user.phone_number),
            status=JanHusBookingStatus.CONFIRMED,
        )

        owner_update_query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  guestListUserFeideIds: ["{guest_user.feide_userid}"]
                }}
              ) {{
                ok
                booking {{
                  id
                  guestList
                  guestListEntries {{
                    feideUserid
                    displayName
                  }}
                }}
              }}
            }}
        """

        owner_response = self.query(owner_update_query, user=self.user)
        self.assertResponseNoErrors(owner_response)
        booking.refresh_from_db()
        self.assertEqual([guest_user.feide_userid], json.loads(booking.guest_list))

        booker_update_query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  guestListUserFeideIds: ["{self.other_user.feide_userid}"]
                }}
              ) {{
                ok
                booking {{
                  id
                  guestList
                }}
              }}
            }}
        """

        booker_response = self.query(booker_update_query, user=booker_user)
        self.assertResponseNoErrors(booker_response)
        booking.refresh_from_db()
        self.assertEqual([self.other_user.feide_userid], json.loads(booking.guest_list))

        responsible_comment_query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  comment: "Nope"
                }}
              ) {{
                ok
                booking {{
                  id
                }}
              }}
            }}
        """

        responsible_comment_response = self.query(responsible_comment_query, user=responsible_user)
        self.assertResponseHasErrors(responsible_comment_response)

        owner_policy_query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  doorAccessPolicy: "ALL_PARTICIPANTS"
                }}
              ) {{
                ok
                booking {{
                  id
                }}
              }}
            }}
        """

        owner_policy_response = self.query(owner_policy_query, user=self.user)
        self.assertResponseHasErrors(owner_policy_response)

        self.add_booking_permission(self.other_user)

        admin_policy_query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  doorAccessPolicy: "ALL_PARTICIPANTS"
                }}
              ) {{
                ok
                booking {{
                  id
                  doorAccessPolicy
                }}
              }}
            }}
        """

        admin_policy_response = self.query(admin_policy_query, user=self.other_user)
        self.assertResponseNoErrors(admin_policy_response)
        booking.refresh_from_db()
        self.assertEqual("ALL_PARTICIPANTS", booking.door_access_policy)

    def test_org_leader_can_update_guest_list_by_feide_id(self):
        organization = OrganizationFactory()
        org_leader = UserFactory(is_indok=True)
        guest_user = UserFactory(is_indok=True)

        MembershipFactory(
            organization=organization,
            user=org_leader,
            group=organization.hr_group,
        )

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_organization=organization,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
        )

        update_query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  guestListUserFeideIds: ["{guest_user.feide_userid}"]
                }}
              ) {{
                ok
                booking {{
                  id
                  guestList
                }}
              }}
            }}
        """

        response = self.query(update_query, user=org_leader)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertEqual([guest_user.feide_userid], json.loads(booking.guest_list))
