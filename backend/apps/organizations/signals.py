from django.contrib.auth.models import Group
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from guardian.shortcuts import assign_perm

from apps.organizations.models import Membership, Organization
from apps.permissions.constants import (
    ORGANIZATION,
    DEFAULT_ORG_GROUPS,
)
from apps.permissions.models import ResponsibleGroup


@receiver(post_save, sender=Membership)
def handle_new_member(instance: Membership, **kwargs):
    primary_group: Group = instance.organization.primary_group
    optional_groups: list[ResponsibleGroup] = instance.groups
    org_group: Group = Group.objects.get(name=ORGANIZATION)

    user = instance.user
    user.groups.add(org_group)
    if primary_group:
        user.groups.add(primary_group.group)
        if primary_group not in instance.groups.all():
            instance.groups.add(primary_group)
    for optional_group in optional_groups.all():
        user.groups.add(optional_group.group)


@receiver(pre_delete, sender=Membership)
def handle_removed_member(instance: Membership, **kwargs):
    primary_group: Group = instance.organization.primary_group
    optional_groups: list[ResponsibleGroup] = instance.groups
    org_group: Group = Group.objects.get(name=ORGANIZATION)

    user = instance.user
    if primary_group:
        user.groups.remove(primary_group.group)
    for optional_group in optional_groups.all():
        user.groups.remove(optional_group.group)
    if not user.memberships.all().exists():
        user.groups.remove(org_group)


@receiver(post_save, sender=Organization)
def create_default_groups(instance: Organization, created, **kwargs):
    """
    Creates and assigns a primary group and HR group to members of the organization.
    """
    if created:
        for org_group in DEFAULT_ORG_GROUPS:
            group = ResponsibleGroup.objects.create(
                group_type=org_group.type_name,
                name=org_group.descriptive_name,
                description=org_group.create_description(instance.name),
                organization=instance,
            )
            for permission in org_group.generic_permissions:
                assign_perm(permission, group.group)
            for permission in org_group.object_permissions:
                assign_perm(permission, group.group, instance)
