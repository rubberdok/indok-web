from typing import Type

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .helpers import get_attendant_group, slot_distribution_is_updated
from .mail import EventEmail
from .models import Attendable, Event, SignUp


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
            if hasattr(event, "attendable"):
                attending_users = event.attendable.users_attending
                attending = previous.user in attending_users
                if attending and event.attendable.get_is_full(instance.user.grade_year):
                    _, waiting_list_by_group = event.attendable.get_attendance_and_waiting_list()
                    group = get_attendant_group(event.attendable.slot_distribution.keys(), instance.user.grade_year)
                    users_on_wait_list = waiting_list_by_group[group]
                    if len(users_on_wait_list) > 0:
                        EventEmail.send_waitlist_notification_email(users_on_wait_list[0], event)


@receiver(pre_save, sender=Attendable)
def send_wait_list_notification_when_events_expand(sender: Type[Attendable], instance: Attendable, **kwargs):
    """
    Send an email to users who are bumped from the waiting list when the number of slots or the slot distribution
    on an attendable event changes.
    """
    if not instance._state.adding:
        previous: Attendable = sender.objects.get(pk=instance.pk)
        if slot_distribution_is_updated(previous.slot_distribution, instance.slot_distribution):

            prev_attending_ids = [u.id for u in previous.users_attending]

            mail_list = []
            for user in instance.users_attending:
                # Find the users that are now attending that were not attending previously
                if user.id not in prev_attending_ids:
                    mail_list.append(user)

            for new_attendant in mail_list:
                EventEmail.send_waitlist_notification_email(new_attendant, instance.event)
