from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.dispatch import receiver
from django.db.models.signals import post_migrate, post_save
from guardian.shortcuts import assign_perm

from apps.permissions.constants import INDOK


@receiver(post_save, sender=get_user_model())
def assign_default_permissions(sender, instance, created, **kwargs):
    if created:
        indok_group = Group.objects.get(name=INDOK)
        instance.groups.add(indok_group)
        assign_perm("users.view_sensitive_info", instance, instance)


@receiver(post_migrate)
def assign_bulk_default_permissions(**kwargs):
    for user in get_user_model().objects.all():
        assign_perm("users.view_sensitive_info", user, user)
