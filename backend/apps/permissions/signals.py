from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.db.models import Q
from django.db.models.signals import post_migrate
from django.dispatch import receiver

from apps.permissions.constants import (
    DEFAULT_INDOK_PERMISSIONS,
    DEFAULT_ORGANIZATION_PERMISSIONS,
    INDOK,
    ORGANIZATION,
)


@receiver(post_migrate)
def assign_standard_organization_permissions(**kwargs):
    """
    Assigns default organization permissions to all users in an organization
    """
    group, created = Group.objects.get_or_create(name=ORGANIZATION)
    if created:
        query: Q = Q()

        for perm in DEFAULT_ORGANIZATION_PERMISSIONS:
            query |= Q(content_type__app_label=perm[0], codename=perm[1])

        permissions = Permission.objects.filter(query)
        group.permissions.set(permissions)
        group.user_set.set(
            get_user_model().objects.filter(
                ~Q(username=settings.ANONYMOUS_USER_NAME), ~Q(organizations=None)
            )
        )


@receiver(post_migrate)
def assign_standard_indok_permissions(**kwargs):
    """
    Assigns default permissions to all authenticated users
    """
    group, created = Group.objects.get_or_create(name=INDOK)
    if created:
        query: Q = Q()

        for perm in DEFAULT_INDOK_PERMISSIONS:
            query |= Q(content_type__app_label=perm[0], codename=perm[1])

        permissions = Permission.objects.filter(query)
        group.permissions.set(permissions)
        group.user_set.set(
            get_user_model().objects.filter(~Q(username=settings.ANONYMOUS_USER_NAME))
        )
