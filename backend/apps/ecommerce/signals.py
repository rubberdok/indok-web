from django.db import transaction
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .mail import send_order_confirmation_mail
from .models import Order


@receiver(pre_save, sender=Order)
def mark_order_confirmation(sender, instance: Order, **kwargs):
    """
    Send an order confirmation email when an order is captured.
    An order is captured when the payment status is changed
    from RESERVED to CAPTURED.
    """
    # Check that we are updating an order, not creating
    if not instance._state.adding:
        previous: Order = sender.objects.get(id=instance.id)
        if (
            previous.payment_status != Order.PaymentStatus.CAPTURED
            and instance.payment_status == Order.PaymentStatus.CAPTURED
        ):
            instance._send_order_confirmation = True


@receiver(post_save, sender=Order)
def send_order_confirmation(sender, instance: Order, **kwargs):
    if getattr(instance, "_send_order_confirmation", False):
        del instance._send_order_confirmation
        transaction.on_commit(lambda: send_order_confirmation_mail(instance))
