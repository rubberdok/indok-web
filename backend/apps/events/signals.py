from django.db.models.signals import pre_save
from django.dispatch import receiver

from apps.events.mail import send_waitlist_notification_email

from .models import Event, SignUp


@receiver(pre_save, sender=SignUp)
def send_order_confirmation(sender, instance: SignUp, **kwargs):
    """
    Send an order confirmation email when an order is captured.
    An order is captured when the payment status is changed from RESERVED to CAPTURED
    """
    # Check that we are updating an order, not creating
    if not instance._state.adding:
        previous: SignUp = sender.objects.get(pk=instance.pk)
        if previous.is_attending and not instance.is_attending:
            event: Event = previous.event
            signed_up = event.signed_up_users
            if len(signed_up) > event.available_slots:
                new_attending_user = signed_up[: event.available_slots + 1].last()
                send_waitlist_notification_email(new_attending_user, event)
