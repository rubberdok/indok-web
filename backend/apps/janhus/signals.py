import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.ecommerce.models import Order
from apps.janhus.mail import send_booking_confirmation
from apps.janhus.models import JanHusBooking, JanHusBookingStatus, JanHusDepositStatus
from apps.janhus.payments import (
    SUCCESSFUL_PAYMENT_STATUSES,
    attach_latest_successful_order,
    outstanding_payment_amount_for_booking,
)

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Order)
def confirm_paid_janhus_bookings(sender, instance: Order, **kwargs):
    """
    A personal JanHus booking is created PROVISIONAL because nobody has paid for it
    yet. Confirm it as soon as its payment succeeds, so the booker gets their
    confirmation and contract without waiting for an admin to notice.

    Organization bookings never pay through Vipps and are not affected.
    """
    if instance.payment_status not in SUCCESSFUL_PAYMENT_STATUSES:
        return

    if not instance.product_id:
        return

    bookings = JanHusBooking.objects.filter(
        vipps_product_id=instance.product_id,
        status=JanHusBookingStatus.PROVISIONAL,
    )

    for booking in bookings:
        if outstanding_payment_amount_for_booking(booking) > 0:
            continue

        attach_latest_successful_order(booking)
        booking.status = JanHusBookingStatus.CONFIRMED
        if booking.deposit_amount > 0 and booking.deposit_status in [
            JanHusDepositStatus.REQUIRED,
            JanHusDepositStatus.REQUESTED,
        ]:
            booking.deposit_status = JanHusDepositStatus.PAID
        booking.save(
            update_fields=["status", "deposit_status", "vipps_order", "updated_at"]
        )

        try:
            send_booking_confirmation(booking)
        except Exception:
            logger.exception(
                "Failed to send JanHus confirmation for booking %s", booking.id
            )
