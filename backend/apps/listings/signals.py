from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.listings.models import Listing

from utils.permissions import assign_object_permissions


@receiver(post_save, sender=Listing)
def assign_listing_permissions(instance: Listing, created: bool, **kwargs) -> None:
    if created:
        assign_object_permissions(
            app_name="listings", model_name="Listing", instance=instance, organization=instance.organization
        )
