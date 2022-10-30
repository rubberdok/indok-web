from typing import Optional

from django.contrib.auth.models import Group
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from guardian.shortcuts import assign_perm

from apps.organizations.models import Membership, Organization
from apps.permissions.constants import (
    ORG_ADMIN_GROUP_NAME,
    ORG_ADMIN_TYPE,
    ORGANIZATION,
    ORG_MEMBER_GROUP_NAME,
    ORG_MEMBER_TYPE,
)
from apps.permissions.models import ResponsibleGroup


@receiver(post_save, sender=Membership)
def handle_new_member(instance: Membership, **kwargs):
    optional_group: Optional[ResponsibleGroup] = instance.group
    group: Group = instance.organization.member_group.group_type
    org_group: Group = Group.objects.get(name=ORGANIZATION)
    user = instance.user
    user.groups.add(org_group)
    if group:
        user.groups.add(group)
        if optional_group:
            user.groups.add(optional_group.group)


@receiver(pre_delete, sender=Membership)
def handle_removed_member(instance: Membership, **kwargs):
    group: Group = instance.organization.member_group.group_type
    org_group: Group = Group.objects.get(name=ORGANIZATION)
    user = instance.user
    if group:
        user.groups.remove(group)

    if not user.memberships.all().exists():
        user.groups.remove(org_group)


@receiver(post_save, sender=Organization)
def create_default_groups(instance: Organization, created, **kwargs):
    """
    Creates and assigns a member group and admin group to members of the organization.
    """
    if created:
        ResponsibleGroup.objects.create(
            name=ORG_MEMBER_GROUP_NAME,
            description=f"Medlemmer av {instance.name}.",
            organization=instance,
            group_type=ORG_MEMBER_TYPE,
        )
        admin_group = ResponsibleGroup.objects.create(
            name=ORG_ADMIN_GROUP_NAME,
            description=f"Admin-gruppen til {instance.name}. Tillatelser for å se og behandle søknader og medlemmer.",
            organization=instance,
            group_type=ORG_ADMIN_TYPE,
        )
        assign_perm("forms.add_form", admin_group.group)
        assign_perm("organizations.manage_organization", admin_group.group)
