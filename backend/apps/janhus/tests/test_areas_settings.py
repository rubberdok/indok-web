import json
from decimal import Decimal

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from graphql import GraphQLError

from apps.ecommerce.models import Order
from apps.janhus.mutations import _resolve_area
from apps.janhus.models import JanHusBooking, JanHusDepositStatus, JanHusBookingStatus, JanHusBookingSettings
from utils.testing.factories.ecommerce import ProductFactory
from apps.janhus.tests.base import JanHusBaseTestCase


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

    def test_areas_query_hides_archived_areas_by_default(self):
        self.first_floor_area.is_active = False
        self.first_floor_area.save(update_fields=["is_active"])

        response = self.query("{ janhusAreas { id } }")
        self.assertResponseNoErrors(response)

        ids = [item["id"] for item in json.loads(response.content)["data"]["janhusAreas"]]
        self.assertNotIn(str(self.first_floor_area.id), ids)
        self.assertIn(str(self.second_floor_area.id), ids)

    def test_areas_query_accepts_include_inactive(self):
        """
        Guards the resolver signature. Graphene passes (root, info, **args)
        positionally, so dropping the unused `info` parameter silently binds it to
        `include_inactive` and breaks every areas query.
        """
        self.first_floor_area.is_active = False
        self.first_floor_area.save(update_fields=["is_active"])

        query = "query Q($i: Boolean) { janhusAreas(includeInactive: $i) { id } }"
        response = self.query(query, variables={"i": True})
        self.assertResponseNoErrors(response)

        ids = [item["id"] for item in json.loads(response.content)["data"]["janhusAreas"]]
        self.assertIn(str(self.first_floor_area.id), ids)

    def test_update_area_requires_settings_permission(self):
        """Areas are created in Django admin; the API may only edit them."""
        query = f"""
            mutation {{
              updateJanhusArea(
                areaData: {{
                  id: "{self.first_floor_area.id}"
                  internalPricePerHour: "50"
                }}
              ) {{
                ok
                area {{
                  id
                  internalPricePerHour
                }}
              }}
            }}
        """

        denied_response = self.query(query, user=self.user)
        self.assertResponseHasErrors(denied_response)

        content_type = ContentType.objects.get_for_model(JanHusBooking)
        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings", content_type=content_type))
        allowed_response = self.query(query, user=self.user)
        self.assertResponseNoErrors(allowed_response)

        self.first_floor_area.refresh_from_db()
        self.assertEqual(50, self.first_floor_area.internal_price_per_hour)

    def test_area_can_be_archived_and_restored(self):
        """The frontend archives via is_active so the action stays reversible."""
        content_type = ContentType.objects.get_for_model(JanHusBooking)
        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings", content_type=content_type))

        def set_active(is_active):
            response = self.query(
                f"""
                    mutation {{
                      updateJanhusArea(
                        areaData: {{ id: "{self.first_floor_area.id}", isActive: {str(is_active).lower()} }}
                      ) {{ ok }}
                    }}
                """,
                user=self.user,
            )
            self.assertResponseNoErrors(response)
            self.first_floor_area.refresh_from_db()

        set_active(False)
        self.assertFalse(self.first_floor_area.is_active)

        set_active(True)
        self.assertTrue(self.first_floor_area.is_active)

    def test_area_cannot_be_moved_under_its_descendant(self):
        content_type = ContentType.objects.get_for_model(JanHusBooking)
        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings", content_type=content_type))
        response = self.query(
            f"""
                mutation {{
                  updateJanhusArea(
                    areaData: {{ id: "{self.entire_house_area.id}", parentId: "{self.first_floor_area.id}" }}
                  ) {{ ok }}
                }}
            """,
            user=self.user,
        )
        self.assertResponseHasErrors(response)

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
        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings", content_type=content_type))

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

    def test_resolve_area_rejects_non_numeric_id(self):
        """A stale pre-0011 area code must read as "not found", not a Django error."""
        with self.assertRaises(GraphQLError) as ctx:
            _resolve_area("FIRST_FLOOR")
        self.assertEqual("Area not found", str(ctx.exception))

    def test_successful_payment_confirms_a_booking_waiting_for_it(self):
        """Paying is what confirms a personal booking; no admin step in between."""
        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Test User",
            responsible_email="test.user@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
            deposit_status=JanHusDepositStatus.REQUIRED,
            deposit_amount=Decimal("300"),
        )
        required_payment_amount = booking.total_price + booking.deposit_amount
        product = ProductFactory(price=required_payment_amount)
        booking.vipps_product = product
        booking.save(update_fields=["vipps_product", "updated_at"])

        Order.objects.create(
            product=product,
            user=self.user,
            quantity=1,
            total_price=required_payment_amount,
            payment_status=Order.PaymentStatus.CAPTURED,
        )

        booking.refresh_from_db()
        self.assertEqual(JanHusBookingStatus.CONFIRMED, booking.status)
        self.assertEqual(JanHusDepositStatus.PAID, booking.deposit_status)

    def test_partial_payment_leaves_a_booking_waiting(self):
        booking = JanHusBooking.objects.create(
            starts_at=self.start_dt,
            ends_at=self.end_dt,
            area=self.first_floor_area,
            owner_user=self.user,
            responsible_name="Test User",
            responsible_email="test.user@example.com",
            responsible_phone="41234567",
            status=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
            deposit_status=JanHusDepositStatus.REQUIRED,
            deposit_amount=Decimal("300"),
        )
        required_payment_amount = booking.total_price + booking.deposit_amount
        product = ProductFactory(price=required_payment_amount)
        booking.vipps_product = product
        booking.save(update_fields=["vipps_product", "updated_at"])

        Order.objects.create(
            product=product,
            user=self.user,
            quantity=1,
            total_price=required_payment_amount - Decimal("1"),
            payment_status=Order.PaymentStatus.CAPTURED,
        )

        booking.refresh_from_db()
        self.assertEqual(JanHusBookingStatus.PENDING_ADMIN_REVIEW, booking.status)


class JanHusBookingSettingsMutationsTestCase(JanHusBaseTestCase):
    def test_updating_booking_settings_creates_the_singleton(self):
        content_type = ContentType.objects.get_for_model(JanHusBooking)
        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings", content_type=content_type))
        response = self.query(
            "mutation { updateJanhusBookingSettings(settingsData: { minDurationMinutes: 30 }) { ok } }",
            user=self.user,
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(JanHusBookingSettings.objects.get().min_duration_minutes, 30)

    def test_updating_booking_settings_rejects_invalid_duration_granularity(self):
        content_type = ContentType.objects.get_for_model(JanHusBooking)
        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings", content_type=content_type))
        response = self.query(
            "mutation { updateJanhusBookingSettings(settingsData: { minDurationMinutes: 20 }) { ok } }",
            user=self.user,
        )
        self.assertResponseHasErrors(response)
