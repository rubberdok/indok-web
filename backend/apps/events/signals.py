import logging
from typing import Type

from django.db import transaction
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .mail import EventEmail
from .models import Event, SignUp

logger = logging.getLogger(__name__)


def _send_waitlist_notification(user, event: Event) -> None:
    try:
        EventEmail.send_waitlist_notification_email(user, event)
    except Exception:
        logger.exception(
            "Unable to send waitlist notification for event %s to user %s",
            event.pk,
            user.pk,
        )


@receiver(pre_save, sender=SignUp)
def prepare_wait_list_notification(sender: Type[SignUp], instance: SignUp, **kwargs):
    """
    Send an email to the user who is bumped from the wait list when another user is no longer attending, if any.
    Prone to race conditions in the case where two users sign off simultaneously and should be resolved.
    """
    if not instance._state.adding:
        previous: SignUp = sender.objects.get(pk=instance.pk)
        if previous.is_attending and not instance.is_attending:
            event: Event = previous.event
            attending_users = event.users_attending
            attending = previous.user in attending_users
            if attending and event.is_full:
                users_on_wait_list = event.users_on_waiting_list
                if len(users_on_wait_list) > 0:
                    instance._waitlist_notification = (users_on_wait_list[0], event)


@receiver(post_save, sender=SignUp)
def send_wait_list_notification(sender: Type[SignUp], instance: SignUp, **kwargs):
    notification = getattr(instance, "_waitlist_notification", None)
    if notification:
        del instance._waitlist_notification
        user, event = notification
        transaction.on_commit(lambda: _send_waitlist_notification(user, event))


@receiver(pre_save, sender=Event)
def send_wait_list_notification_when_events_expand(sender: Type[Event], instance: Event, **kwargs):
    if not instance._state.adding:
        previous: Event = sender.objects.get(pk=instance.pk)
        if (
            previous.available_slots is not None
            and instance.available_slots is not None
            and (previous.available_slots < instance.available_slots)
        ):
            users_on_wait_list = previous.users_on_waiting_list[: instance.available_slots - previous.available_slots]
            if users_on_wait_list:
                instance._waitlist_notification_users = users_on_wait_list


@receiver(post_save, sender=Event)
def send_wait_list_notifications_when_events_expand(sender: Type[Event], instance: Event, **kwargs):
    users = getattr(instance, "_waitlist_notification_users", [])
    if users:
        del instance._waitlist_notification_users
        for user in users:
            transaction.on_commit(lambda user=user: _send_waitlist_notification(user, instance))
