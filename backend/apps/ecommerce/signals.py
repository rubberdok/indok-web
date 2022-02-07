from django.db.models.signals import pre_save
from django.dispatch import receiver

from .mail import send_order_confirmation_mail
from .models import Order


@receiver(pre_save, sender=Order)
def send_order_confirmation(sender, instance: Order, **kwargs):
    """
    Send an order confirmation email when an order is captured.
    An order is captured when the payment status is changed from RESERVED to CAPTURED
    """
    # Check that we are updating an order, not creating
    if not instance._state.adding:
        previous: Order = sender.objects.get(id=instance.id)
        if (
            previous.payment_status == Order.PaymentStatus.RESERVED
            and instance.payment_status == Order.PaymentStatus.CAPTURED
        ):
            send_order_confirmation_mail(instance)
