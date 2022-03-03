from typing import Type

from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from .mail import EventEmail
from .models import Event, SignUp
from utils.permissions import assign_object_permissions


@receiver(pre_save, sender=SignUp)
def send_wait_list_notification(sender: Type[SignUp], instance: SignUp, **kwargs):
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
                    EventEmail.send_waitlist_notification_email(users_on_wait_list[0], event)


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
            for user in users_on_wait_list:
                EventEmail.send_waitlist_notification_email(user, instance)


@receiver(post_save, sender=Event)
def assign_event_permissions(instance: Event, created: bool, **kwargs) -> None:
    """Assigns appropriate object permissions to newly created events."""
    if created:
        assign_object_permissions(
            app_name="events",
            model_name="Event",
            instance=instance,
            organization=instance.organization,
        )
