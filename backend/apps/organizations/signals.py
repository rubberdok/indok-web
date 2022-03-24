from django.contrib.auth.models import Group
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from utils.permissions import assign_object_permissions
from guardian.shortcuts import assign_perm

from apps.organizations.models import Membership, Organization
from apps.permissions.constants import (
    ORGANIZATION,
    DEFAULT_ORG_PERMISSION_GROUPS,
    ORG_MEMBER_GROUP_TYPE,
)
from apps.permissions.models import ResponsibleGroup


@receiver(post_save, sender=Membership)
def assign_membership_permissions(instance: Membership, created: bool, **kwargs) -> None:
    """Assigns appropriate object permissions to newly created memberships."""
    if created:
        assign_object_permissions(
            app="organizations", model="Membership", instance=instance, organization=instance.organization
        )


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
def ensure_default_org_permission_groups(instance: Organization, **kwargs):
    """Ensures that organizations have correct default organization permission groups."""
    for (group_type, default_group) in DEFAULT_ORG_PERMISSION_GROUPS.items():
        existing_group: ResponsibleGroup = None

        # Checks if the default group already exists on the org.
        responsible_group: ResponsibleGroup
        for responsible_group in instance.permission_groups.all():
            if responsible_group.group_type == group_type:
                existing_group = responsible_group
                break

        # Creates the ResponsibleGroup for the default group on the org.
        if existing_group is None:
            responsible_group = ResponsibleGroup.objects.create(
                group_type=group_type,
                name=default_group.name,
                description=default_group.create_description(instance.name),
                organization=instance,
            )

            try:
                perms = default_group.formatted_model_permissions(app="organizations", model="Organization")
                for perm in perms:
                    assign_perm(perm, responsible_group.group, instance)
            except (KeyError):
                # If assigning permissions failed,
                continue

        # Updates
        else:
            existing_group_changed = False

            if existing_group.name != default_group.name:
                existing_group.name = default_group.name
                existing_group_changed = True

            updated_description = default_group.create_description(instance.name)
            if existing_group.description != updated_description:
                existing_group.description = updated_description
                existing_group_changed = True

            if set(existing_group.group.permissions.all()) != set(default_group.permissions):
                existing_group.group.permissions.set(default_group.formatted_permissions())

            if existing_group_changed:
                existing_group.save()
