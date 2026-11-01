from decimal import Decimal
from datetime import timedelta

from django.core.exceptions import ValidationError as DjangoValidationError
from django.test import TestCase
from django.utils import timezone

from apps.janhus.models import JanHusArea, JanHusBooking, JanHusDepositStatus, JanHusBookingStatus, JanHusEventType
from utils.testing.factories.organizations import OrganizationFactory
from utils.testing.factories.users import UserFactory


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

    def test_booking_validation_rejects_conflicting_or_missing_owners(self):
        organization = OrganizationFactory()
        for booking in (
            self._booking(owner_organization=organization),
            self._booking(owner_user=None),
        ):
            with self.subTest(booking=booking):
                with self.assertRaises(DjangoValidationError):
                    booking.full_clean()

    def test_ownerless_booking_string_has_a_safe_fallback(self):
        booking = self._booking(owner_user=None, booker_name="")
        self.assertIn("Unknown", str(booking))

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
                self.assertEqual(expected, self._booking(minutes=minutes, **overrides).total_price)

    def test_computed_price_is_rounded_up_to_a_whole_krone(self):
        for minutes, expected in [(25, Decimal("42")), (20, Decimal("34")), (60, Decimal("100"))]:
            with self.subTest(minutes=minutes):
                self.assertEqual(expected, self._booking(minutes=minutes).total_price)

    def test_hand_entered_amounts_keep_at_most_two_decimals(self):
        booking = self._booking(
            price_override_amount=Decimal("42.005"),
            deposit_amount=Decimal("10.0049"),
            deposit_status=JanHusDepositStatus.REQUIRED,
        )
        self.assertEqual(Decimal("42.01"), booking.total_price)
        self.assertEqual(Decimal("10.00"), booking.outstanding_deposit_amount)

        booking.refresh_from_db()
        self.assertEqual(Decimal("42.01"), booking.price_override_amount)
        self.assertEqual(Decimal("10.00"), booking.deposit_amount)

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
                booking = self._booking(deposit_status=status, deposit_amount=Decimal("1000.00"))
                expected = Decimal("1000.00") if status in outstanding else Decimal("0")
                self.assertEqual(expected, booking.outstanding_deposit_amount)

        zero = self._booking(deposit_status=JanHusDepositStatus.REQUIRED, deposit_amount=Decimal("0"))
        self.assertEqual(Decimal("0"), zero.outstanding_deposit_amount)

    def test_payment_total_adds_rent_and_outstanding_deposit(self):
        booking = self._booking(
            deposit_status=JanHusDepositStatus.REQUIRED,
            deposit_amount=Decimal("1000.00"),
        )
        self.assertEqual(Decimal("1200.00"), booking.payment_total_price)

        booking.deposit_status = JanHusDepositStatus.PAID
        self.assertEqual(booking.total_price, booking.payment_total_price)
