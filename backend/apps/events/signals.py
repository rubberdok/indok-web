from typing import Type

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .mail import EventEmail
from .models import Event, SignUp


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
            if hasattr(event, "attendable") and event.attendable is not None:
                attending_users = event.attendable.users_attending
                attending = previous.user in attending_users
                if attending and event.attendable.get_is_full(instance.user.grade_year):
                    users_on_wait_list = event.attendable.users_on_waiting_list
                    if len(users_on_wait_list) > 0:
                        EventEmail.send_waitlist_notification_email(users_on_wait_list[0], event)


@receiver(pre_save, sender=Event)
def send_wait_list_notification_when_events_expand(sender: Type[Event], instance: Event, **kwargs):
    if not instance._state.adding:
        previous: Event = sender.objects.get(pk=instance.pk)
        if (
            hasattr(previous, "attendable")
            and previous.attendable is not None
            and hasattr(instance, "attendable")
            and instance.attendable is not None
            and (previous.attendable.total_available_slots < instance.attendable.total_available_slots)
        ):
            users_on_wait_list = previous.attendable.users_on_waiting_list[
                : instance.attendable.total_available_slots - previous.attendable.total_available_slots
            ]
            for user in users_on_wait_list:
                EventEmail.send_waitlist_notification_email(user, instance)
