from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_migrate, post_save
from guardian.shortcuts import assign_perm


@receiver(post_save, sender=get_user_model())
def assign_default_permissions(sender, instance, created, **kwargs):
    if created:
        assign_perm("users.view_sensitive_info", instance, instance)


@receiver(post_migrate)
def assign_bulk_default_permissions(**kwargs):
    for user in get_user_model().objects.all():
        assign_perm("users.view_sensitive_info", user, user)