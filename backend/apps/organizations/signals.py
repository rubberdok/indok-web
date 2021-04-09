from django.db.models.signals import post_save, pre_delete, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import Group

from apps.organizations.models import Membership, Organization
from apps.permissions.models import ResponsibleGroup

@receiver(post_save, sender=Membership)
def handle_new_member(sender, **kwargs):
    member: Membership = kwargs["instance"]
    group: Group = member.organization.group
    if group:
        user= member.user
        user.groups.add(group)
        user.save()


@receiver(pre_delete, sender=Membership)
def handle_removed_memeber(sender, **kwargs):
    member: Membership = kwargs["instance"]
    group: Group = member.organization.group
    if group:
        user = member.user
        user.groups.remove(group)
        user.save()


@receiver(pre_save, sender=Organization)
def create_default_group_if_none_is_set(sender, instance, **kwrags):
  if instance.group is None:
    group = ResponsibleGroup.objects.create(name=instance.name)
    instance.group = group
