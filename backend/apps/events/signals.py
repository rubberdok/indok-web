from django.db.models.signals import pre_save
from django.dispatch import receiver

from apps.events.mail import send_waitlist_notification_email

from .models import Event, SignUp


@receiver(pre_save, sender=SignUp)
def send_order_confirmation(sender, instance: SignUp, **kwargs):
    """
    Send an email to the user who is bumped from the wait list when another user is no longer attending, if any.
    Prone to race conditions in the case where two users sign off simultaneously and should be resolved.
    """
    if not instance._state.adding:
        previous: SignUp = sender.objects.get(pk=instance.pk)
        if previous.is_attending and not instance.is_attending:
            event: Event = previous.event
            signed_up = event.signed_up_users
            attending = signed_up[: event.available_slots].filter(user=previous.user).exists()
            if attending and len(signed_up) > event.available_slots:
                new_attending_user = signed_up[: event.available_slots + 1].last()
                if new_attending_user is not None:
                    send_waitlist_notification_email(new_attending_user, event)
