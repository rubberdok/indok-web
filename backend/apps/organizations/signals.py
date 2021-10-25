from django.contrib.auth.models import Group
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from guardian.shortcuts import assign_perm

from apps.organizations.models import Membership, Organization
from apps.permissions.constants import (
    ORGANIZATION,
    DEFAULT_ORG_GROUPS,
    ORG_MEMBER_GROUP_TYPE,
)
from apps.permissions.models import ResponsibleGroup


@receiver(post_save, sender=Membership)
def handle_new_member(instance: Membership, **kwargs):
    user = instance.user

    org_group: Group = Group.objects.get(name=ORGANIZATION)
    user.groups.add(org_group)

    groups: list[ResponsibleGroup] = instance.groups
    if not any(group.group_type == ORG_MEMBER_GROUP_TYPE for group in groups.all()):
        primary_group = instance.organization.permission_groups.get(group_type=ORG_MEMBER_GROUP_TYPE)
        groups.add(primary_group)
    for group in groups.all():
        user.groups.add(group.group)


@receiver(pre_delete, sender=Membership)
def handle_removed_member(instance: Membership, **kwargs):
    groups: list[ResponsibleGroup] = instance.groups
    org_group: Group = Group.objects.get(name=ORGANIZATION)

    user = instance.user
    for group in groups.all():
        user.groups.remove(group.group)
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
                group_type=org_group.group_type,
                name=org_group.name,
                description=org_group.create_description(instance.name),
                organization=instance,
            )
            for permission in org_group.permissions:
                if permission[0] == "organizations":
                    assign_perm(f"{permission[0]}.{permission[1]}", group.group, instance)
