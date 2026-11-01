from datetime import date, datetime, time, timedelta

from django.core.exceptions import ValidationError as DjangoValidationError
from django.test import TestCase
from django.utils import timezone
from graphql import GraphQLError

from apps.janhus.mutations import _apply_overlap_rules
from apps.janhus.models import JanHusArea, JanHusBooking, JanHusBookingStatus
from apps.janhus.rules import (
    determine_initial_status,
    get_or_create_settings,
    get_overlapping_bookings,
    is_in_active_booking_semester,
    validate_booking_semester_rules,
    validate_booking_window,
    validate_time_rules,
)
from utils.testing.factories.organizations import OrganizationFactory
from utils.testing.factories.users import UserFactory


class JanHusRulesTestCase(TestCase):
    def setUp(self) -> None:
        self.settings = get_or_create_settings()
        self.entire_house, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        self.first_floor, _ = JanHusArea.objects.get_or_create(name="1. etasje", defaults={"parent": self.entire_house})
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

    def test_initial_status_depends_on_booking_type_and_payment(self):
        cases = [
            ("external needs review", True, False, JanHusBookingStatus.PENDING_ADMIN_REVIEW),
            ("personal inside the window", False, False, JanHusBookingStatus.CONFIRMED),
            ("personal waits for payment", False, True, JanHusBookingStatus.PENDING_ADMIN_REVIEW),
        ]

        for label, is_external, requires_payment, expected in cases:
            with self.subTest(case=label):
                initial_status = determine_initial_status(
                    is_external_booking=is_external,
                    requires_payment=requires_payment,
                )
                self.assertEqual(expected, initial_status)

    def test_the_windows_limit_what_end_users_may_request(self):
        def on(days):
            return timezone.make_aware(datetime.combine(timezone.localdate() + timedelta(days=days), time(10, 0)))

        organization = OrganizationFactory()

        def check(days, owner_organization=None):
            validate_booking_window(starts_at=on(days), owner_organization=owner_organization, settings=self.settings)

        # The defaults: 4 weeks ahead for everyone but organisations, 6 for organisations. The last day counts.
        check(28)
        check(42, organization)
        for label, days, owner_organization in [("personal or external", 29, None), ("organisation", 43, organization)]:
            with self.subTest(case=label):
                with self.assertRaises(GraphQLError):
                    check(days, owner_organization)

    def test_the_windows_follow_the_settings(self):
        self.settings.organization_booking_opens_weeks_before = 30
        self.settings.general_booking_opens_weeks_before = 4
        self.settings.save()
        organization = OrganizationFactory()

        def on(days):
            return timezone.make_aware(datetime.combine(timezone.localdate() + timedelta(days=days), time(10, 0)))

        def check(days, owner_organization=None):
            validate_booking_window(starts_at=on(days), owner_organization=owner_organization, settings=self.settings)

        check(30 * 7, organization)
        with self.assertRaises(GraphQLError):
            check(30 * 7 + 1, organization)
        with self.assertRaises(GraphQLError):
            check(5 * 7)

        self.settings.general_booking_opens_weeks_before = 6
        self.settings.save()
        check(5 * 7)

    def test_only_janhus_admins_may_book_over_another_booking(self):
        existing = self._booking(area=self.first_floor, status=JanHusBookingStatus.PENDING_ADMIN_REVIEW)

        def over_it():
            return JanHusBooking(starts_at=existing.starts_at, ends_at=existing.ends_at, area=self.entire_house)

        # Not even a booking that waits for payment gives way: that was the priority booking level.
        with self.assertRaises(GraphQLError):
            _apply_overlap_rules(booking=over_it(), actor=UserFactory(is_indok=True), settings=self.settings)
        existing.refresh_from_db()
        self.assertEqual(JanHusBookingStatus.PENDING_ADMIN_REVIEW, existing.status)

        admin = UserFactory(is_indok=True, is_superuser=True)
        self.assertEqual([existing], _apply_overlap_rules(booking=over_it(), actor=admin, settings=self.settings))

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
        self.assertNotIn(booking, overlaps(self.first_floor, exclude_booking_id=booking.id))

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
        self.assertFalse(is_in_active_booking_semester(target_date=date(2026, 9, 10), settings=settings))

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
            validate_booking_semester_rules(starts_at=inside, ends_at=inside + timedelta(hours=2), settings=settings)

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
                    validate_time_rules(starts_at=starts_at, ends_at=ends_at, settings=self.settings)

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

        self.assertNotIn(booking, get_overlapping_bookings(settings=self.settings, **back_to_back))

        self.settings.buffer_minutes = 60
        self.settings.save()

        self.assertIn(booking, get_overlapping_bookings(settings=self.settings, **back_to_back))
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
