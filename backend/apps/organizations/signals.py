from typing import Optional

from django.contrib.auth.models import Group
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from guardian.shortcuts import assign_perm

from apps.organizations.models import Membership, Organization
from apps.permissions.constants import (
    HR_GROUP_NAME,
    HR_TYPE,
    ORGANIZATION,
    PRIMARY_GROUP_NAME,
    PRIMARY_TYPE,
)
from apps.permissions.models import ResponsibleGroup


@receiver(post_save, sender=Membership)
def handle_new_member(instance: Membership, **kwargs):
    optional_group: Optional[ResponsibleGroup] = instance.group
    group: Group = instance.organization.primary_group.group
    org_group: Group = Group.objects.get(name=ORGANIZATION)
    user = instance.user
    user.groups.add(org_group)
    if group:
        user.groups.add(group)
        if optional_group:
            user.groups.add(optional_group.group)


@receiver(pre_delete, sender=Membership)
def handle_removed_member(instance: Membership, **kwargs):
    group: Group = instance.organization.primary_group.group
    org_group: Group = Group.objects.get(name=ORGANIZATION)
    user = instance.user
    if group:
        user.groups.remove(group)

    if not user.memberships.all().exists():
        user.groups.remove(org_group)


@receiver(post_save, sender=Organization)
def create_default_groups(instance: Organization, created, **kwargs):
    """
    Creates and assigns a primary group and HR group to members of the organization.
    """
    if created:
        ResponsibleGroup.objects.create(
            name=PRIMARY_GROUP_NAME,
            description=f"Medlemmer av {instance.name}.",
            organization=instance,
            group_type=PRIMARY_TYPE,
        )
        hr_group = ResponsibleGroup.objects.create(
            name=HR_GROUP_NAME,
            description=f"HR-gruppen til {instance.name}. Tillatelser for å se og behandle søknader.",
            organization=instance,
            group_type=HR_TYPE,
        )
        assign_perm("forms.add_form", hr_group.group)
