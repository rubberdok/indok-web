from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.events.models import Event

from utils.permissions import assign_object_permissions


@receiver(post_save, sender=Event)
def assign_event_permissions(instance: Event, created: bool, **kwargs) -> None:
    """Assigns appropriate object permissions to newly created events."""
    if created:
        assign_object_permissions(
            app_name="events", model_name="Event", instance=instance, organization=instance.organization
        )
