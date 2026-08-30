import json
from decimal import Decimal
from datetime import date, datetime, time, timedelta
from unittest.mock import patch

from django.contrib.auth.models import Permission
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase
from django.utils import timezone
from graphql import GraphQLError

from apps.ecommerce.models import Order
from apps.janhus import mail
from apps.janhus.mail import (
    send_booking_confirmation,
    send_booking_request_received,
    send_booking_request_rejected,
)
from apps.janhus.models import (
    JanHusArea,
    JanHusBooking,
    JanHusBookingLevel,
    JanHusBookingRequest,
    JanHusDepositStatus,
    JanHusBookingSettings,
    JanHusBookingStatus,
    JanHusEventType,
    JanHusOrganizationBookingLevel,
    JanHusUserBookingLevel,
)
from apps.janhus.permissions import (
    can_book_for_organization,
    can_edit_guest_list,
    can_view_booking_details,
    get_hr_organizations,
    get_user_email_candidates,
    has_manage_booking_permission,
    has_manage_settings_permission,
    is_booking_owner,
    is_connected_to_booking,
    normalize_phone_number,
)
from apps.janhus.rules import (
    EXTERNAL_LEVEL,
    GENERAL_LEVEL,
    ORGANIZATION_LEVEL,
    PRIORITY_LEVEL,
    booking_weeks_in_advance,
    challenges_provisionals,
    determine_initial_status,
    ensure_default_areas,
    ensure_default_levels,
    get_conflicting_areas,
    get_or_create_settings,
    get_overlapping_bookings,
    is_in_active_booking_semester,
    resolve_booking_level,
    validate_booking_semester_rules,
    validate_time_rules,
)
from apps.organizations.models import Organization
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

        self.entire_house_area, _ = JanHusArea.objects.get_or_create(
            name="Hele huset"
        )
        self.first_floor_area, _ = JanHusArea.objects.get_or_create(
            name="1. etasje", defaults={"parent": self.entire_house_area}
        )
        self.second_floor_area, _ = JanHusArea.objects.get_or_create(
            name="2. etasje", defaults={"parent": self.entire_house_area}
        )

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
                  area: \"{self.first_floor_area.id}\"
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
                  area: "{self.first_floor_area.id}"
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
                  area: "{self.first_floor_area.id}"
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

        response = self.query(query, user=non_indok_user)
        self.assertResponseHasErrors(response)

        content = json.loads(response.content)
        self.assertIn("Only Indøk students", content["errors"][0]["message"])

    def test_create_booking_rejects_private_event_type_when_disabled(self):
        JanHusBookingSettings.objects.create(private_bookings_enabled=False)

        query = f"""
            mutation {{
              createJanhusBooking(
                bookingData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  responsibleName: "Indok User"
                  responsibleEmail: "indok@example.com"
                  responsiblePhone: "41234567"
                  eventType: "PRIVATE"
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
        self.assertResponseHasErrors(response)

        content = json.loads(response.content)
        self.assertIn("Private JanHus-bookinger er midlertidig deaktivert", content["errors"][0]["message"])

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
                  responsibleName: \"Responsible User\"
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

        self.first_floor_area.internal_price_per_hour = Decimal("100")
        self.first_floor_area.external_price_per_hour = Decimal("200")
        self.first_floor_area.cleaning_fee = Decimal("50")
        self.first_floor_area.save()

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
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

    def test_manually_marked_as_paid_bypasses_payment_requirement(self):
        self.add_booking_permission(self.user)

        self.first_floor_area.internal_price_per_hour = Decimal("100")
        self.first_floor_area.external_price_per_hour = Decimal("200")
        self.first_floor_area.cleaning_fee = Decimal("50")
        self.first_floor_area.save()

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.PROVISIONAL,
            deposit_status=JanHusDepositStatus.REQUIRED,
            deposit_amount=Decimal("300"),
        )

        mark_paid_query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  manuallyMarkedAsPaid: true
                }}
              ) {{
                ok
              }}
            }}
        """
        mark_paid_response = self.query(mark_paid_query, user=self.user)
        self.assertResponseNoErrors(mark_paid_response)

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
                  status
                }}
              }}
            }}
        """
        confirm_response = self.query(confirm_query, user=self.user)
        self.assertResponseNoErrors(confirm_response)

        booking.refresh_from_db()
        self.assertEqual(JanHusBookingStatus.CONFIRMED, booking.status)

    def test_non_admin_cannot_set_manually_marked_as_paid(self):
        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.PROVISIONAL,
        )

        query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  manuallyMarkedAsPaid: true
                }}
              ) {{
                ok
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseHasErrors(response)
        booking.refresh_from_db()
        self.assertFalse(booking.manually_marked_as_paid)

    def test_price_override_amount_takes_precedence(self):
        self.add_booking_permission(self.user)

        self.first_floor_area.internal_price_per_hour = Decimal("100")
        self.first_floor_area.external_price_per_hour = Decimal("200")
        self.first_floor_area.cleaning_fee = Decimal("50")
        self.first_floor_area.save()

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.PROVISIONAL,
        )

        query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  priceOverrideAmount: "42.50"
                }}
              ) {{
                ok
                booking {{
                  totalPrice
                }}
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)
        self.assertEqual(
            Decimal("42.50"),
            Decimal(content["data"]["updateJanhusBooking"]["booking"]["totalPrice"]),
        )

    def test_price_override_tier_switches_to_external_pricing(self):
        self.add_booking_permission(self.user)

        self.first_floor_area.internal_price_per_hour = Decimal("100")
        self.first_floor_area.external_price_per_hour = Decimal("200")
        self.first_floor_area.cleaning_fee = Decimal("0")
        self.first_floor_area.save()

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            event_type="PRIVATE",
            status=JanHusBookingStatus.PROVISIONAL,
        )

        self.assertEqual(Decimal("200"), booking.total_price)

        query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{
                  id: "{booking.id}"
                  priceOverrideTier: "EXTERNAL"
                }}
              ) {{
                ok
                booking {{
                  totalPrice
                }}
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertEqual(Decimal("400"), booking.total_price)

    def test_create_booking_and_block_overlap(self):
        create_booking_query = f"""
            mutation {{
              createJanhusBooking(
                bookingData: {{
                  startsAt: \"{self.start_dt.isoformat()}\"
                  endsAt: \"{self.end_dt.isoformat()}\"
                  area: \"{self.entire_house_area.id}\"
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
                  area: \"{self.first_floor_area.id}\"
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
                  area: \"{self.first_floor_area.id}\"
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
                  area: \"{self.first_floor_area.id}\"
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

        self.first_floor_area.internal_price_per_hour = Decimal("100")
        self.first_floor_area.external_price_per_hour = Decimal("200")
        self.first_floor_area.cleaning_fee = Decimal("0")
        self.first_floor_area.save()

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
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
            area=self.first_floor_area,
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

    def _payment_booking(self, **overrides):
        defaults = dict(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
            deposit_status="REQUIRED",
            deposit_amount=Decimal("500"),
        )
        defaults.update(overrides)
        return JanHusBooking.objects.create(**defaults)

    def _create_payment_product_query(self, booking):
        return f"""
            mutation {{
              createJanhusPaymentProduct(bookingId: "{booking.id}") {{
                ok
                productId
              }}
            }}
        """

    def test_payment_product_uses_organization_configured_by_admin(self):
        self.add_booking_permission(self.user)

        configured_organization = OrganizationFactory(name="Janus Eiendom")
        OrganizationFactory(name="Ikke selger")

        JanHusBookingSettings.objects.create(
            payment_provider_organization=configured_organization
        )

        booking = self._payment_booking()

        response = self.query(self._create_payment_product_query(booking), user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertEqual(
            configured_organization.id, booking.vipps_product.organization_id
        )

    def test_payment_product_falls_back_to_default_organization_when_unset(self):
        self.add_booking_permission(self.user)

        fallback_organization = OrganizationFactory(name="Laveste id")

        booking = self._payment_booking()

        response = self.query(self._create_payment_product_query(booking), user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertIsNotNone(booking.vipps_product_id)

        expected_organization = (
            Organization.objects.filter(pk=4).first()
            or Organization.objects.order_by("id").first()
        )
        self.assertEqual(
            expected_organization.id, booking.vipps_product.organization_id
        )
        self.assertEqual(fallback_organization.id, expected_organization.id)

    def test_payment_product_seller_ignores_booking_owner_organization(self):
        """
        Product.organization is the seller, never the buyer. A booking made by a
        user who leads an organization must not credit that organization.
        """
        self.add_booking_permission(self.user)

        configured_organization = OrganizationFactory(name="Janus Eiendom")
        buyer_organization = OrganizationFactory(name="Indøl")
        MembershipFactory(
            organization=buyer_organization,
            user=self.user,
            group=buyer_organization.hr_group,
        )

        JanHusBookingSettings.objects.create(
            payment_provider_organization=configured_organization
        )

        booking = self._payment_booking()

        response = self.query(self._create_payment_product_query(booking), user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertEqual(
            configured_organization.id, booking.vipps_product.organization_id
        )
        self.assertNotEqual(
            buyer_organization.id, booking.vipps_product.organization_id
        )

    def test_organization_booking_records_price_without_vipps_payment(self):
        """
        Organization rentals are settled internally: they carry a price for sales
        reporting, but nothing is collectable through Vipps.
        """
        organization = OrganizationFactory()
        self.first_floor_area.internal_price_per_hour = Decimal("100")
        self.first_floor_area.save(update_fields=["internal_price_per_hour"])

        booking = self._payment_booking(owner_user=None, owner_organization=organization)

        self.assertEqual(Decimal("200"), booking.total_price)
        self.assertIsNone(booking.vipps_product_id)

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
                  responsibleName: "Responsible User"
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
        MembershipFactory(
            organization=organization, user=leader, group=organization.hr_group
        )
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
                response = self.query(
                    self._org_booking_request_query(organization), user=user
                )
                if allowed:
                    self.assertResponseNoErrors(response)
                else:
                    self.assertResponseHasErrors(response)
                self.assertEqual(
                    allowed,
                    JanHusBookingRequest.objects.filter(
                        owner_organization=organization
                    ).exists(),
                )

    def test_create_booking_rejects_organization_member_without_hr_group(self):
        organization = OrganizationFactory()
        plain_member = UserFactory(is_indok=True)
        MembershipFactory(organization=organization, user=plain_member, group=None)

        query = f"""
            mutation {{
              createJanhusBooking(
                bookingData: {{
                  startsAt: "{self.start_dt.isoformat()}"
                  endsAt: "{self.end_dt.isoformat()}"
                  area: "{self.first_floor_area.id}"
                  ownerOrganizationId: "{organization.id}"
                  responsibleName: "Responsible User"
                  responsibleEmail: "responsible@example.com"
                  responsiblePhone: "41234567"
                }}
              ) {{
                ok
                booking {{
                  id
                }}
              }}
            }}
        """

        response = self.query(query, user=plain_member)

        self.assertResponseHasErrors(response)
        self.assertFalse(
            JanHusBooking.objects.filter(owner_organization=organization).exists()
        )

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
                  responsibleName: "Responsible User"
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
                  responsibleName: "Responsible User"
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
            ("confirmed", JanHusBookingStatus.PENDING_ADMIN_REVIEW, "CONFIRMED",
             "send_booking_confirmation", True),
            ("declined", JanHusBookingStatus.PENDING_ADMIN_REVIEW, "DECLINED",
             "send_booking_declined", True),
            # Re-confirming an already confirmed booking must not mail again.
            ("already confirmed", JanHusBookingStatus.CONFIRMED, "CONFIRMED",
             "send_booking_confirmation", False),
        ]

        for label, initial, new_status, target, expected in cases:
            with self.subTest(case=label):
                booking = self._pending_booking(status=initial)
                with patch(f"apps.janhus.mutations.{target}") as mocked_send:
                    response = self.query(
                        self._review_booking_query(booking, new_status), user=self.user
                    )
                self.assertResponseNoErrors(response)
                self.assertEqual(expected, mocked_send.called)

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
                with patch(
                    "apps.janhus.mutations.send_booking_request_rejected"
                ) as mocked_send:
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
                  responsibleName: "Ola"
                  responsibleEmail: "ola@example.com"
                  responsiblePhone: "41234567"
                }}
              ) {{
                ok
              }}
            }}
        """

        with patch(
            "apps.janhus.mutations.send_booking_request_received"
        ) as mocked_send:
            response = self.query(query, user=self.user)

        self.assertResponseNoErrors(response)
        mocked_send.assert_called_once()

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


    def test_bookable_organizations_returns_only_hr_organizations(self):
        lead_organization = OrganizationFactory(name="Leder i forening")
        member_organization = OrganizationFactory(name="Medlem i forening")
        unrelated_organization = OrganizationFactory(name="Uten tilknytning")

        MembershipFactory(
            organization=lead_organization,
            user=self.user,
            group=lead_organization.hr_group,
        )
        MembershipFactory(
            organization=member_organization, user=self.user, group=None
        )

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
        returned_ids = [
            organization["id"]
            for organization in content["data"]["janhusBookableOrganizations"]
        ]

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
            comment
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
                response = (
                    self.query(self.DETAILS_QUERY, user=user)
                    if user
                    else self.query(self.DETAILS_QUERY)
                )
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


class JanHusAreaTestCase(JanHusBaseTestCase):
    def test_conflicting_area_ids_include_ancestors_and_descendants(self):
        self.assertCountEqual(
            [self.first_floor_area.id, self.entire_house_area.id],
            self.first_floor_area.conflicting_area_ids,
        )
        self.assertCountEqual(
            [
                self.entire_house_area.id,
                self.first_floor_area.id,
                self.second_floor_area.id,
            ],
            self.entire_house_area.conflicting_area_ids,
        )

    def test_create_and_update_area_requires_settings_permission(self):
        query = f"""
            mutation {{
              createJanhusArea(
                areaData: {{
                  name: "Kjeller"
                  parentId: "{self.entire_house_area.id}"
                  internalPricePerHour: "50"
                  externalPricePerHour: "100"
                }}
              ) {{
                ok
                area {{
                  id
                  name
                }}
              }}
            }}
        """

        denied_response = self.query(query, user=self.user)
        self.assertResponseHasErrors(denied_response)

        content_type = ContentType.objects.get_for_model(JanHusBooking)
        self.user.user_permissions.add(
            Permission.objects.get(
                codename="manage_settings", content_type=content_type
            )
        )
        allowed_response = self.query(query, user=self.user)
        self.assertResponseNoErrors(allowed_response)

        content = json.loads(allowed_response.content)
        self.assertEqual("Kjeller", content["data"]["createJanhusArea"]["area"]["name"])

    def test_delete_area_soft_deletes_when_referenced(self):
        JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
        )

        content_type = ContentType.objects.get_for_model(JanHusBooking)
        self.user.user_permissions.add(
            Permission.objects.get(
                codename="manage_settings", content_type=content_type
            )
        )

        query = f"""
            mutation {{
              deleteJanhusArea(id: "{self.first_floor_area.id}") {{
                ok
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)

        self.first_floor_area.refresh_from_db()
        self.assertFalse(self.first_floor_area.is_active)


class JanHusMailTestCase(TestCase):
    def _confirmed_booking(self, **overrides):
        start_dt = timezone.make_aware(
            datetime.combine((timezone.now() + timedelta(days=7)).date(), time(12, 0))
        )
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
        self.assertEqual(
            mail.SUBJECTS["decision"] + booking.area.name, kwargs["subject"]
        )
        self.assertIn(booking.reference, kwargs["body"])
        # bcc, so the two contacts do not see each other's address
        self.assertCountEqual(
            ["booker@example.com", "responsible@example.com"], kwargs["bcc"]
        )

    def _booking_request(self, **overrides):
        start_dt = timezone.make_aware(
            datetime.combine((timezone.now() + timedelta(days=7)).date(), time(12, 0))
        )
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
        JanHusBookingSettings.objects.create(
            booking_contact_email="janhus@example.com"
        )
        booking_request = self._booking_request()

        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
            send_booking_request_received(booking_request)

        self.assertEqual(2, mocked_email.call_count)
        admin_kwargs = mocked_email.call_args_list[1].kwargs
        self.assertEqual(["janhus@example.com"], admin_kwargs["bcc"])
        self.assertTrue(
            admin_kwargs["subject"].startswith(mail.SUBJECTS["admin_reserve"])
        )
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

        self.assertTrue(
            any("Could not send JanHus email" in line for line in logs.output)
        )

    def test_confirmation_mail_attaches_the_contract_pdf(self):
        booking = self._confirmed_booking()

        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
            send_booking_confirmation(booking)

        mocked_email.return_value.attach.assert_called_once()
        name, content, mimetype = mocked_email.return_value.attach.call_args.args

        self.assertEqual("Kontrakt.pdf", name)
        self.assertEqual("application/pdf", mimetype)
        self.assertTrue(content.startswith(b"%PDF-"))

class JanHusRulesTestCase(TestCase):
    def setUp(self) -> None:
        self.settings = get_or_create_settings()
        self.levels = ensure_default_levels(self.settings)
        self.entire_house, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        self.first_floor, _ = JanHusArea.objects.get_or_create(
            name="1. etasje", defaults={"parent": self.entire_house}
        )
        self.second_floor, _ = JanHusArea.objects.get_or_create(
            name="2. etasje", defaults={"parent": self.entire_house}
        )

    def _at(self, *, days: int, hour: int = 10, minutes: int = 0):
        target = (timezone.now() + timedelta(days=days)).date()
        return timezone.make_aware(datetime.combine(target, time(hour, minutes)))

    def _booking(self, *, area, status=None):
        starts_at = self._at(days=14)
        return JanHusBooking.objects.create(
            starts_at=starts_at,
            ends_at=starts_at + timedelta(hours=2),
            area=area,
            owner_user=UserFactory(is_indok=True),
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=status or JanHusBookingStatus.CONFIRMED,
        )

    def test_booking_level_is_resolved_from_owner_and_assignment(self):
        user = UserFactory(is_indok=True)
        organization = OrganizationFactory()
        assigned_user = UserFactory(is_indok=True)
        assigned_organization = OrganizationFactory()
        JanHusUserBookingLevel.objects.create(
            user=assigned_user, level=self.levels[PRIORITY_LEVEL]
        )
        JanHusOrganizationBookingLevel.objects.create(
            organization=assigned_organization, level=self.levels[PRIORITY_LEVEL]
        )

        cases = [
            ("external", user, None, True, EXTERNAL_LEVEL),
            ("organization default", None, organization, False, ORGANIZATION_LEVEL),
            ("organization assigned", None, assigned_organization, False, PRIORITY_LEVEL),
            ("user default", user, None, False, GENERAL_LEVEL),
            ("user assigned", assigned_user, None, False, PRIORITY_LEVEL),
        ]

        for label, owner, organization_owner, is_external, expected in cases:
            with self.subTest(case=label):
                level = resolve_booking_level(
                    user=owner,
                    owner_organization=organization_owner,
                    is_external_booking=is_external,
                )
                self.assertEqual(self.levels[expected], level)

    def test_internal_booking_without_user_or_organization_is_rejected(self):
        with self.assertRaises(GraphQLError):
            resolve_booking_level(
                user=None, owner_organization=None, is_external_booking=False
            )

    def test_initial_status_depends_on_level_and_how_far_ahead_the_booking_is(self):
        # General opens 4 weeks ahead, organization 6.
        cases = [
            ("external needs review", EXTERNAL_LEVEL, 14, True, JanHusBookingStatus.PENDING_ADMIN_REVIEW),
            ("priority confirms anytime", PRIORITY_LEVEL, 365, False, JanHusBookingStatus.CONFIRMED),
            ("inside the window confirms", GENERAL_LEVEL, 14, False, JanHusBookingStatus.CONFIRMED),
            ("organization too early holds", ORGANIZATION_LEVEL, 70, False, JanHusBookingStatus.PROVISIONAL),
        ]

        for label, level, days, is_external, expected in cases:
            with self.subTest(case=label):
                status = determine_initial_status(
                    booking_level=self.levels[level],
                    starts_at=self._at(days=days),
                    is_external_booking=is_external,
                    settings=self.settings,
                )
                self.assertEqual(expected, status)

    def test_a_level_that_cannot_hold_provisionals_may_not_book_early(self):
        with self.assertRaises(GraphQLError):
            determine_initial_status(
                booking_level=self.levels[GENERAL_LEVEL],
                starts_at=self._at(days=70),
                is_external_booking=False,
                settings=self.settings,
            )

    def test_provisionals_are_only_overridable_by_priority_levels_booking_early(self):
        cases = [
            ("priority, before the organization window", PRIORITY_LEVEL, 70, True),
            ("priority, inside the window", PRIORITY_LEVEL, 14, False),
            ("organization has no override rights", ORGANIZATION_LEVEL, 70, False),
        ]

        for label, level, days, expected in cases:
            with self.subTest(case=label):
                self.assertEqual(
                    expected,
                    challenges_provisionals(
                        booking_level=self.levels[level],
                        starts_at=self._at(days=days),
                        settings=self.settings,
                    ),
                )

    def test_overlap_covers_the_area_tree_but_not_siblings_or_dead_bookings(self):
        booking = self._booking(area=self.first_floor)

        def overlaps(area, **kwargs):
            return get_overlapping_bookings(
                starts_at=booking.starts_at,
                ends_at=booking.ends_at,
                area=area,
                **kwargs,
            )

        self.assertIn(booking, overlaps(self.first_floor))
        self.assertIn(booking, overlaps(self.entire_house))
        self.assertNotIn(booking, overlaps(self.second_floor))
        self.assertNotIn(
            booking, overlaps(self.first_floor, exclude_booking_id=booking.id)
        )

        for ignored in [JanHusBookingStatus.DECLINED, JanHusBookingStatus.CANCELLED]:
            with self.subTest(status=ignored):
                booking.status = ignored
                booking.save(update_fields=["status"])
                self.assertNotIn(booking, overlaps(self.first_floor))

    def test_only_dates_inside_an_active_semester_are_bookable(self):
        settings = self.settings
        settings.fall_start_date = date(2026, 8, 1)
        settings.fall_end_date = date(2026, 12, 20)
        settings.spring_start_date = date(2027, 1, 5)
        settings.spring_end_date = date(2027, 6, 15)
        settings.save()

        cases = [
            ("inside autumn", date(2026, 9, 10), True),
            ("first day of autumn", date(2026, 8, 1), True),
            ("last day of autumn", date(2026, 12, 20), True),
            ("christmas break", date(2026, 12, 27), False),
            ("inside spring", date(2027, 3, 1), True),
        ]
        for label, target, expected in cases:
            with self.subTest(case=label):
                self.assertEqual(
                    expected,
                    is_in_active_booking_semester(target_date=target, settings=settings),
                )

        settings.fall_semester_active = False
        settings.save()
        self.assertFalse(
            is_in_active_booking_semester(
                target_date=date(2026, 9, 10), settings=settings
            )
        )

    def test_bookings_outside_the_active_semesters_are_rejected(self):
        settings = self.settings
        settings.fall_start_date = date(2026, 8, 1)
        settings.fall_end_date = date(2026, 12, 20)
        settings.spring_start_date = date(2027, 1, 5)
        settings.spring_end_date = date(2027, 6, 15)
        settings.save()

        outside = timezone.make_aware(datetime(2026, 12, 27, 10, 0))
        with self.assertRaises(GraphQLError):
            validate_booking_semester_rules(
                starts_at=outside,
                ends_at=outside + timedelta(hours=2),
                settings=settings,
            )

        settings.fall_semester_active = False
        settings.spring_semester_active = False
        settings.save()
        inside = timezone.make_aware(datetime(2026, 9, 10, 10, 0))
        with self.assertRaises(GraphQLError):
            validate_booking_semester_rules(
                starts_at=inside, ends_at=inside + timedelta(hours=2), settings=settings
            )

    def test_invalid_time_ranges_are_rejected(self):
        start = self._at(days=14, hour=12)
        misaligned_start = self._at(days=14, hour=12, minutes=10)
        before_opening = self._at(days=14, hour=3)

        cases = [
            ("end before start", start, start - timedelta(hours=1)),
            ("shorter than the minimum", start, start + timedelta(minutes=30)),
            ("duration off the granularity", start, start + timedelta(minutes=75)),
            ("start off the granularity", misaligned_start, misaligned_start + timedelta(hours=2)),
            ("before opening hour", before_opening, before_opening + timedelta(hours=2)),
        ]

        for label, starts_at, ends_at in cases:
            with self.subTest(case=label):
                with self.assertRaises(GraphQLError):
                    validate_time_rules(
                        starts_at=starts_at, ends_at=ends_at, settings=self.settings
                    )

    def test_valid_bookings_pass_including_across_midnight(self):
        # The default window is 08:00 -> 02:00, so 23:00-01:00 is inside it.
        for hour in [12, 23]:
            with self.subTest(hour=hour):
                start = self._at(days=14, hour=hour)
                validate_time_rules(
                    starts_at=start,
                    ends_at=start + timedelta(hours=2),
                    settings=self.settings,
                )

    def test_a_buffer_forces_a_gap_between_bookings(self):
        booking = self._booking(area=self.first_floor)
        back_to_back = {
            "starts_at": booking.ends_at,
            "ends_at": booking.ends_at + timedelta(hours=2),
            "area": self.first_floor,
        }

        self.assertNotIn(
            booking, get_overlapping_bookings(settings=self.settings, **back_to_back)
        )

        self.settings.buffer_minutes = 60
        self.settings.save()

        self.assertIn(
            booking, get_overlapping_bookings(settings=self.settings, **back_to_back)
        )
        self.assertNotIn(
            booking,
            get_overlapping_bookings(
                starts_at=booking.ends_at + timedelta(hours=2),
                ends_at=booking.ends_at + timedelta(hours=4),
                area=self.first_floor,
                settings=self.settings,
            ),
        )

    def test_buffer_must_align_with_slot_granularity(self):
        self.settings.buffer_minutes = 45  # granularity is 30
        with self.assertRaises(DjangoValidationError):
            self.settings.full_clean()

        self.settings.buffer_minutes = 60
        self.settings.full_clean()

    def test_a_level_only_challenges_strictly_lower_priorities(self):
        far_ahead = self._at(days=70)
        priority = self.levels[PRIORITY_LEVEL]

        def provisional_at(level):
            booking = self._booking(
                area=self.first_floor, status=JanHusBookingStatus.PROVISIONAL
            )
            booking.booking_level = level
            booking.save(update_fields=["booking_level"])
            return booking

        lower = provisional_at(self.levels[ORGANIZATION_LEVEL])
        same = provisional_at(priority)

        self.assertTrue(
            challenges_provisionals(
                booking_level=priority,
                starts_at=far_ahead,
                settings=self.settings,
                provisionals=[lower],
            )
        )

        self.assertFalse(
            challenges_provisionals(
                booking_level=priority,
                starts_at=far_ahead,
                settings=self.settings,
                provisionals=[same],
            )
        )
        self.assertFalse(
            challenges_provisionals(
                booking_level=priority,
                starts_at=far_ahead,
                settings=self.settings,
                provisionals=[lower, same],
            )
        )

class JanHusPermissionsTestCase(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory(is_indok=True)
        self.other_user = UserFactory(is_indok=True)
        self.area, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        self.starts_at = timezone.now() + timedelta(days=14)

    def _grant(self, user, codename):
        content_type = ContentType.objects.get_for_model(JanHusBooking)
        user.user_permissions.add(
            Permission.objects.get(codename=codename, content_type=content_type)
        )
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

        self.assertTrue(
            has_manage_booking_permission(UserFactory(is_indok=True, is_superuser=True))
        )

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
        MembershipFactory(
            organization=organization, user=leader, group=organization.hr_group
        )
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
        by_phone = UserFactory(
            is_indok=False, email="unrelated@example.com", phone_number="45555555"
        )
        stranger = UserFactory(
            is_indok=False, email="stranger@example.com", phone_number="46666666"
        )
        admin = self._grant(self.user, "manage_booking")

        booking.booker_phone = "45555555"
        booking.save(update_fields=["booker_phone"])

        self.assertTrue(is_connected_to_booking(by_email, booking))
        self.assertTrue(is_connected_to_booking(by_phone, booking))
        self.assertTrue(is_connected_to_booking(admin, booking))
        self.assertFalse(is_connected_to_booking(stranger, booking))
        self.assertFalse(is_connected_to_booking(None, booking))

class JanHusPricingTestCase(TestCase):
    def setUp(self) -> None:
        self.area = JanHusArea.objects.create(
            name="Prisområde",
            internal_price_per_hour=Decimal("100.00"),
            external_price_per_hour=Decimal("250.00"),
            cleaning_fee=Decimal("600.00"),
        )
        self.user = UserFactory(is_indok=True)
        self.starts_at = timezone.now() + timedelta(days=14)

    def _booking(self, *, minutes=120, **overrides):
        defaults = dict(
            starts_at=self.starts_at,
            ends_at=self.starts_at + timedelta(minutes=minutes),
            area=self.area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.CONFIRMED,
        )
        defaults.update(overrides)
        return JanHusBooking.objects.create(**defaults)

    def test_external_pricing_is_chosen_by_booking_type_or_override(self):
        external = {"owner_user": None, "is_external_booking": True}
        cases = [
            ("internal booking", {}, False),
            ("external booking", external, True),
            ("external event type", {"event_type": JanHusEventType.EXTERNAL}, True),
            ("override to internal", {**external, "price_override_tier": "INTERNAL"}, False),
            ("override to external", {"price_override_tier": "EXTERNAL"}, True),
        ]
        for label, overrides, expected in cases:
            with self.subTest(case=label):
                self.assertEqual(expected, self._booking(**overrides).uses_external_pricing)

    def test_total_price_follows_the_rate_duration_and_extras(self):
        cases = [
            ("internal rate", 120, {}, Decimal("200.00")),
            ("external rate", 120, {"owner_user": None, "is_external_booking": True}, Decimal("500.00")),
            ("cleaning fee added once", 120, {"cleaning_requested": True}, Decimal("800.00")),
            ("charged pro rata", 90, {}, Decimal("150.00")),
            (
                "override replaces everything",
                120,
                {"cleaning_requested": True, "price_override_amount": Decimal("42.00")},
                Decimal("42.00"),
            ),
        ]
        for label, minutes, overrides, expected in cases:
            with self.subTest(case=label):
                self.assertEqual(
                    expected, self._booking(minutes=minutes, **overrides).total_price
                )

    def test_deposit_is_outstanding_only_while_required_or_requested(self):
        outstanding = [JanHusDepositStatus.REQUIRED, JanHusDepositStatus.REQUESTED]
        settled = [
            JanHusDepositStatus.NOT_REQUIRED,
            JanHusDepositStatus.PAID,
            JanHusDepositStatus.REFUNDED,
            JanHusDepositStatus.WITHHELD,
        ]

        for status in outstanding + settled:
            with self.subTest(status=status):
                booking = self._booking(
                    deposit_status=status, deposit_amount=Decimal("1000.00")
                )
                expected = Decimal("1000.00") if status in outstanding else Decimal("0")
                self.assertEqual(expected, booking.outstanding_deposit_amount)

        zero = self._booking(
            deposit_status=JanHusDepositStatus.REQUIRED, deposit_amount=Decimal("0")
        )
        self.assertEqual(Decimal("0"), zero.outstanding_deposit_amount)

    def test_payment_total_adds_rent_and_outstanding_deposit(self):
        booking = self._booking(
            deposit_status=JanHusDepositStatus.REQUIRED,
            deposit_amount=Decimal("1000.00"),
        )
        self.assertEqual(Decimal("1200.00"), booking.payment_total_price)

        booking.deposit_status = JanHusDepositStatus.PAID
        self.assertEqual(booking.total_price, booking.payment_total_price)
