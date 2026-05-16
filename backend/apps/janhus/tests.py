import json
from decimal import Decimal
from datetime import datetime, time, timedelta
from unittest.mock import patch

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase
from django.utils import timezone

from apps.ecommerce.models import Order
from apps.janhus.mail import send_pending_review_notification
from apps.janhus.models import (
    JanHusAreaConfiguration,
    JanHusBooking,
    JanHusBookingRequest,
    JanHusDepositStatus,
    JanHusBookingSettings,
    JanHusBookingStatus,
)
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.ecommerce import ProductFactory
from utils.testing.factories.users import UserFactory


class JanHusBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.user = UserFactory(is_indok=True)
        self.other_user = UserFactory(is_indok=True)

        self.start_dt = timezone.make_aware(
            datetime.combine(
                (timezone.now() + timedelta(days=14)).date(), time(hour=10, minute=0)
            )
        )
        self.end_dt = self.start_dt + timedelta(hours=2)

    def add_booking_permission(self, user):
        content_type = ContentType.objects.get_for_model(JanHusBooking)
        user.user_permissions.add(
            Permission.objects.get(codename="manage_booking", content_type=content_type)
        )


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
                  area: "FIRST_FLOOR"
                  requesterName: "Non Indok User"
                  requesterEmail: "non-indok@example.com"
                  requesterPhone: "41234567"
                  responsibleName: "Responsible User"
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
                  area: "FIRST_FLOOR"
                  requesterName: "Non Indok User"
                  requesterEmail: "non-indok@example.com"
                  requesterPhone: "41234567"
                  responsibleName: "Responsible User"
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
            content["data"]["createJanhusBookingRequest"]["bookingRequest"][
                "eventType"
            ],
        )

    def test_non_indok_user_cannot_create_non_external_booking(self):
        non_indok_user = UserFactory(is_indok=False)

        query = f"""
            mutation {{
              createJanhusBooking(
                bookingData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "FIRST_FLOOR"
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

        response = self.query(query, user=non_indok_user)
        self.assertResponseHasErrors(response)

        content = json.loads(response.content)
        self.assertIn("Only Indøk students", content["errors"][0]["message"])

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
                  area: \"FIRST_FLOOR\"
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
        request_id = create_content["data"]["createJanhusBookingRequest"][
            "bookingRequest"
        ]["id"]
        self.assertEqual(
            guest_list_value,
            create_content["data"]["createJanhusBookingRequest"]["bookingRequest"][
                "guestList"
            ],
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
            review_content["data"]["reviewJanhusBookingRequest"]["booking"][
                "guestList"
            ],
        )
        self.assertEqual(
            JanHusBookingStatus.PROVISIONAL,
            review_content["data"]["reviewJanhusBookingRequest"]["booking"]["status"],
        )

        booking = JanHusBooking.objects.first()
        self.assertIsNotNone(booking)
        self.assertEqual(guest_list_value, booking.guest_list)
        self.assertEqual(JanHusBookingStatus.PROVISIONAL, booking.status)

    def test_non_org_booking_requires_full_payment_before_confirmed(self):
        self.add_booking_permission(self.user)

        JanHusAreaConfiguration.objects.create(
            area="FIRST_FLOOR",
            internal_price_per_hour=Decimal("100"),
            external_price_per_hour=Decimal("200"),
            cleaning_fee=Decimal("50"),
            default_deposit_amount=Decimal("0"),
        )

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area="FIRST_FLOOR",
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.PROVISIONAL,
            cleaning_requested=True,
            deposit_status=JanHusDepositStatus.REQUIRED,
            deposit_amount=Decimal("300"),
        )

        confirm_query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
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

        denied_response = self.query(confirm_query, user=self.user)
        self.assertResponseHasErrors(denied_response)

        required_payment_amount = booking.total_price + booking.deposit_amount
        product = ProductFactory(price=required_payment_amount)
        booking.vipps_product = product
        booking.save(update_fields=["vipps_product", "updated_at"])

        paid_order = Order.objects.create(
            product=product,
            user=self.user,
            quantity=1,
            total_price=required_payment_amount,
            payment_status=Order.PaymentStatus.CAPTURED,
        )

        allowed_response = self.query(confirm_query, user=self.user)
        self.assertResponseNoErrors(allowed_response)

        booking.refresh_from_db()
        self.assertEqual(JanHusBookingStatus.CONFIRMED, booking.status)
        self.assertEqual(JanHusDepositStatus.PAID, booking.deposit_status)
        self.assertEqual(paid_order.id, booking.vipps_order_id)

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
        self.assertIn(
            "outside of active booking semesters", content["errors"][0]["message"]
        )

    def test_update_booking_syncs_existing_vipps_product_price(self):
        self.add_booking_permission(self.user)

        JanHusAreaConfiguration.objects.create(
            area="FIRST_FLOOR",
            internal_price_per_hour=Decimal("100"),
            external_price_per_hour=Decimal("200"),
            cleaning_fee=Decimal("0"),
            default_deposit_amount=Decimal("0"),
        )

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area="FIRST_FLOOR",
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
            deposit_status="REQUIRED",
            deposit_amount=Decimal("200"),
        )

        product = ProductFactory(price=Decimal("400"))
        booking.vipps_product = product
        booking.save(update_fields=["vipps_product", "updated_at"])

        query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  depositStatus: "REQUIRED"
                  depositAmount: "500"
                }}
              ) {{
                ok
                booking {{
                  id
                }}
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        product.refresh_from_db()

        self.assertEqual(Decimal("500"), booking.deposit_amount)
        self.assertEqual(Decimal("700"), product.price)

    def test_create_payment_product_rejects_organization_bookings(self):
        self.add_booking_permission(self.user)

        organization = OrganizationFactory()

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area="FIRST_FLOOR",
            owner_organization=organization,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
            deposit_status="REQUIRED",
            deposit_amount=Decimal("500"),
        )

        query = f"""
            mutation {{
              createJanhusPaymentProduct(bookingId: "{booking.id}") {{
                ok
                productId
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseHasErrors(response)

        content = json.loads(response.content)
        self.assertIn("handled internally", content["errors"][0]["message"])

    def test_create_payment_product_uses_provider_fallback_for_user_without_org(self):
        self.add_booking_permission(self.user)

        provider_organization = OrganizationFactory(
            name="Hovedstyret", slug="hovedstyret"
        )

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area="FIRST_FLOOR",
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
            deposit_status="REQUIRED",
            deposit_amount=Decimal("500"),
        )

        query = f"""
            mutation {{
              createJanhusPaymentProduct(bookingId: "{booking.id}") {{
                ok
                productId
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertIsNotNone(booking.vipps_product_id)
        self.assertEqual(
            provider_organization.id, booking.vipps_product.organization_id
        )

    def test_update_booking_guest_list_access_and_policy_admin_only(self):
        guest_user = UserFactory(is_indok=True)
        booker_user = UserFactory(is_indok=True, phone_number="41111111")
        responsible_user = UserFactory(is_indok=True, phone_number="42222222")

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area="FIRST_FLOOR",
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

        responsible_comment_response = self.query(
            responsible_comment_query, user=responsible_user
        )
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
            area="FIRST_FLOOR",
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
            area="FIRST_FLOOR",
            owner_organization=organization,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
        )
        personal_booking = JanHusBooking.objects.create(
            starts_at=self.start_dt + timedelta(hours=4),
            ends_at=self.end_dt + timedelta(hours=4),
            area="SECOND_FLOOR",
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
        member_ids = [
            item["id"]
            for item in json.loads(member_response.content)["data"]["janhusMyBookings"]
        ]
        self.assertIn(str(personal_booking.id), member_ids)
        self.assertNotIn(str(org_booking.id), member_ids)

        leader_response = self.query(query, user=leader_user)
        self.assertResponseNoErrors(leader_response)
        leader_ids = [
            item["id"]
            for item in json.loads(leader_response.content)["data"]["janhusMyBookings"]
        ]
        self.assertIn(str(org_booking.id), leader_ids)

    def test_my_bookings_include_booker_or_responsible_contacts(self):
        booker_booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area="FIRST_FLOOR",
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
            area="SECOND_FLOOR",
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

        booking_ids = [
            item["id"]
            for item in json.loads(response.content)["data"]["janhusMyBookings"]
        ]
        self.assertIn(str(booker_booking.id), booking_ids)
        self.assertIn(str(responsible_booking.id), booking_ids)

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
            area="FIRST_FLOOR",
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
        self.assertTrue(
            any(
                result["feideUserid"] == searchable_user.feide_userid
                for result in results
            )
        )
        self.assertTrue(
            any(result["displayName"] == "Siri Nordmann" for result in results)
        )

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

        results = json.loads(allowed_response.content)["data"][
            "janhusGuestSearchForRequest"
        ]
        self.assertTrue(
            any(
                result["feideUserid"] == searchable_user.feide_userid
                for result in results
            )
        )
        self.assertTrue(
            any(
                result["displayName"] == "ReqSearchUnique Nordmann"
                for result in results
            )
        )


class JanHusMailTestCase(TestCase):
    def test_pending_review_notification_includes_booker_and_responsible(self):
        start_dt = timezone.make_aware(
            datetime.combine((timezone.now() + timedelta(days=7)).date(), time(12, 0))
        )
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
        self.assertCountEqual(
            ["responsible@example.com", "booker@example.com"], recipient_list
        )
