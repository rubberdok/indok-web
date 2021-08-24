from typing import Optional, TYPE_CHECKING, Type
from django.core.exceptions import FieldError
from django.db.models.query_utils import Q
from django.db.models.signals import post_migrate, post_save, pre_delete
from django.dispatch import receiver
from django.contrib.auth.models import Group
from guardian.shortcuts import assign_perm

from apps.organizations.models import Membership, Organization
from apps.permissions.constants import HR, ORGANIZATION, PRIMARY
from apps.permissions.models import ResponsibleGroup

if TYPE_CHECKING:
    from apps.organizations import models
    from apps.permissions import models as perm_models


@receiver(post_save, sender=Membership)
def handle_new_member(sender, instance: Membership, **kwargs):
    optional_group: Optional[ResponsibleGroup] = instance.group
    group: Group = instance.organization.primary_group.group
    org_group: Group = Group.objects.get(name=ORGANIZATION)
    if group:
        user = instance.user
        user.groups.add(group)
        user.groups.add(org_group)
        if optional_group:
            user.groups.add(optional_group.group)


@receiver(pre_delete, sender=Membership)
def handle_removed_member(sender, instance: Membership, **kwargs):
    group: Group = instance.organization.primary_group.group
    if group:
        user = instance.user
        user.groups.remove(group)


@receiver(post_save, sender=Organization)
def create_default_groups(sender, instance: Organization, created, **kwargs):
    """
    Creates and assigns a primary group and HR group to members of the organization.
    """
    if created:
        ResponsibleGroup.objects.create(
            name=instance.name,
            description=f"Medlemmer av {instance.name}.",
            organization=instance,
            group_type=PRIMARY,
        )
        hr_group = ResponsibleGroup.objects.create(
            name="HR",
            description=f"HR-gruppen til {instance.name}. Tillatelser for å se og behandle søknader.",
            organization=instance,
            group_type=HR,
        )
        assign_perm("forms.add_form", hr_group.group)


@receiver(post_migrate)
def create_missing_default_groups(apps, **kwargs):
    Organization: Type["models.Organization"] = apps.get_model(
        "organizations", "Organization"
    )
    orgs = Organization.objects.all()
    ResponsibleGroup: Type["perm_models.ResponsibleGroup"] = apps.get_model(
        "permissions", "ResponsibleGroup"
    )

    org: "models.Organization"
    for org in orgs:
        try:
            try:
                ResponsibleGroup.objects.get(
                    name=org.name,
                    description=f"HR-gruppen til {org.name}. Tillatelser for å se og behandle søknader.",
                    organization=org,
                    group_type=PRIMARY,
                )
            except ResponsibleGroup.DoesNotExist:
                ResponsibleGroup.objects.create(
                    name=org.name,
                    description=f"HR-gruppen til {org.name}. Tillatelser for å se og behandle søknader.",
                    organization=org,
                    group_type=PRIMARY,
                )

            try:
                hr_group = ResponsibleGroup.objects.get(
                    name="HR",
                    description=f"HR-gruppen til {org.name}. Tillatelser for å se og behandle søknader.",
                    organization=org,
                    group_type=HR,
                )
                assign_perm("forms.add_form", hr_group.group)
            except ResponsibleGroup.DoesNotExist:
                hr_group = ResponsibleGroup.objects.create(
                    name="HR",
                    description=f"HR-gruppen til {org.name}. Tillatelser for å se og behandle søknader.",
                    organization=org,
                    group_type=HR,
                )
                assign_perm("forms.add_form", hr_group.group)
        except FieldError:
            break
