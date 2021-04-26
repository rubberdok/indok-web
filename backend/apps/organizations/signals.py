from django.db.models.signals import post_save, pre_delete, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import Group

from apps.organizations.models import Membership, Organization
from apps.permissions.models import ResponsibleGroup

@receiver(post_save, sender=Membership)
def handle_new_member(sender, **kwargs):
    member: Membership = kwargs["instance"]
    group: Group = member.organization.primary_group.group
    if group:
        user= member.user
        user.groups.add(group)
        user.save()


@receiver(pre_delete, sender=Membership)
def handle_removed_memeber(sender, **kwargs):
    member: Membership = kwargs["instance"]
    group: Group = member.organization.primary_group.group
    if group:
        user = member.user
        user.groups.remove(group)
        user.save()

@receiver(pre_save, sender=Organization)
def create_primary_group(sender, instance, created, **kwargs):
  """
  Creates and assigns a primary group and HR group to members of the organization.
  """
  if created and instance.primary_group is None:
    primary_group = ResponsibleGroup.objects.create(name=instance.name, description=f"Medlemmer av {instance.name}.")
    hr_group = ResponsibleGroup.objects.create(name="HR", description=f"HR-gruppen til {instance.name}. Tillatelser for å se og behandle søknader.")
    instance.primary_group = primary_group
    instance.hr_group = hr_group
