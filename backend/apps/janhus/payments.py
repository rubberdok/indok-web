"""
Payment state for JanHus bookings.

Lives in its own module so both the mutations and the order signal can ask the
same questions ("what is still owed on this booking?") without importing each
other. Organization bookings are settled internally and never pay through Vipps,
so every helper here treats them as nothing owed.
"""
from decimal import Decimal

from django.db.models import Sum

from apps.ecommerce.models import Order
from apps.janhus.models import JanHusBooking

SUCCESSFUL_PAYMENT_STATUSES = [
    Order.PaymentStatus.RESERVED,
    Order.PaymentStatus.CAPTURED,
]


def is_non_organization_booking(booking: JanHusBooking) -> bool:
    return booking.owner_organization_id is None


def required_payment_amount_for_non_org_booking(booking: JanHusBooking) -> Decimal:
    required_deposit = max(booking.deposit_amount or Decimal("0"), Decimal("0"))
    return booking.total_price + required_deposit


def successful_payment_orders_for_booking(booking: JanHusBooking):
    if not booking.vipps_product_id:
        return Order.objects.none()

    return Order.objects.filter(
        product_id=booking.vipps_product_id,
        payment_status__in=SUCCESSFUL_PAYMENT_STATUSES,
    )


def paid_amount_for_booking(booking: JanHusBooking) -> Decimal:
    paid_amount = successful_payment_orders_for_booking(booking).aggregate(
        total_paid=Sum("total_price")
    )["total_paid"]
    return paid_amount or Decimal("0")


def outstanding_payment_amount_for_booking(booking: JanHusBooking) -> Decimal:
    if booking.manually_marked_as_paid:
        return Decimal("0")

    if not is_non_organization_booking(booking):
        return Decimal("0")

    outstanding_amount = required_payment_amount_for_non_org_booking(
        booking
    ) - paid_amount_for_booking(booking)
    return max(outstanding_amount, Decimal("0"))


def attach_latest_successful_order(booking: JanHusBooking) -> None:
    latest_successful_order = (
        successful_payment_orders_for_booking(booking).order_by("-timestamp").first()
    )
    if latest_successful_order and booking.vipps_order_id != latest_successful_order.id:
        booking.vipps_order = latest_successful_order
