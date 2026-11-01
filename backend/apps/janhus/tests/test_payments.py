import json
from decimal import Decimal
from unittest.mock import patch

from graphql import GraphQLError

from apps.ecommerce.models import Order, Product
from apps.janhus.mutations import _resolve_payment_product_organization
from apps.janhus.models import JanHusBooking, JanHusDepositStatus, JanHusBookingSettings, JanHusBookingStatus
from apps.organizations.models import Organization
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.ecommerce import ProductFactory
from apps.janhus.tests.base import JanHusBaseTestCase


class JanHusPaymentMutationsTestCase(JanHusBaseTestCase):
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
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
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
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
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
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
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
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
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

    def test_price_override_tier_can_be_cleared_with_an_empty_string(self):
        """Null means "leave unchanged", so "" is the only way to remove an override."""
        self.add_booking_permission(self.user)

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
            price_override_tier="EXTERNAL",
        )

        query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{ id: "{booking.id}", priceOverrideTier: "" }}
              ) {{
                ok
              }}
            }}
        """

        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertEqual("", booking.price_override_tier)

    def test_price_override_tier_rejects_an_unknown_value(self):
        self.add_booking_permission(self.user)

        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
        )

        query = f"""
            mutation {{
              updateJanhusBooking(
                bookingData: {{ id: "{booking.id}", priceOverrideTier: "GRATIS" }}
              ) {{
                ok
              }}
            }}
        """

        self.assertResponseHasErrors(self.query(query, user=self.user))

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
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
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

        JanHusBookingSettings.objects.create(payment_provider_organization=configured_organization)

        booking = self._payment_booking()

        response = self.query(self._create_payment_product_query(booking), user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertEqual(configured_organization.id, booking.vipps_product.organization_id)

    def test_payment_product_falls_back_to_default_organization_when_unset(self):
        self.add_booking_permission(self.user)

        fallback_organization = OrganizationFactory(name="Laveste id")

        booking = self._payment_booking()

        response = self.query(self._create_payment_product_query(booking), user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertIsNotNone(booking.vipps_product_id)

        expected_organization = Organization.objects.filter(pk=4).first() or Organization.objects.order_by("id").first()
        self.assertEqual(expected_organization.id, booking.vipps_product.organization_id)
        self.assertEqual(fallback_organization.id, expected_organization.id)

    def test_payment_product_creation_refreshes_an_existing_product(self):
        self.add_booking_permission(self.user)
        seller = OrganizationFactory()
        JanHusBookingSettings.objects.create(payment_provider_organization=seller)
        booking = self._payment_booking()
        product = ProductFactory(name="Old", description="Old description", price=Decimal("1"), organization=seller)
        booking.vipps_product = product
        booking.save(update_fields=["vipps_product", "updated_at"])
        product_count = Product.objects.count()

        response = self.query(self._create_payment_product_query(booking), user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        product.refresh_from_db()
        self.assertEqual(Product.objects.count(), product_count)
        self.assertEqual(booking.vipps_product_id, product.id)
        self.assertEqual(product.price, booking.total_price + booking.deposit_amount)

    def test_payment_product_requires_a_seller_organization(self):
        Organization.objects.all().delete()
        settings = JanHusBookingSettings(payment_provider_organization=None)
        with self.assertRaises(GraphQLError) as error:
            _resolve_payment_product_organization(settings=settings)
        self.assertIn("Kontakt Rubberdøk", str(error.exception))

    def test_confirmation_mail_failure_does_not_revert_a_paid_booking(self):
        self.first_floor_area.internal_price_per_hour = Decimal("100")
        self.first_floor_area.save()
        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Responsible",
            responsible_email="responsible@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
            deposit_status=JanHusDepositStatus.PAID,
        )
        product = ProductFactory(price=booking.total_price)
        booking.vipps_product = product
        booking.save(update_fields=["vipps_product", "updated_at"])

        with patch("apps.janhus.signals.send_booking_confirmation", side_effect=RuntimeError("mail unavailable")):
            with self.assertLogs("apps.janhus.signals", level="ERROR"):
                Order.objects.create(
                    product=product,
                    user=self.user,
                    quantity=1,
                    total_price=booking.total_price,
                    payment_status=Order.PaymentStatus.CAPTURED,
                )
        booking.refresh_from_db()
        self.assertEqual(booking.status, JanHusBookingStatus.CONFIRMED)

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

        JanHusBookingSettings.objects.create(payment_provider_organization=configured_organization)

        booking = self._payment_booking()

        response = self.query(self._create_payment_product_query(booking), user=self.user)
        self.assertResponseNoErrors(response)

        booking.refresh_from_db()
        self.assertEqual(configured_organization.id, booking.vipps_product.organization_id)
        self.assertNotEqual(buyer_organization.id, booking.vipps_product.organization_id)

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
