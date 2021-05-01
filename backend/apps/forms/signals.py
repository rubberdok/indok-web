from django.dispatch import receiver
from django.db.models.signals import post_save, pre_delete, pre_save
from apps.forms.models import Form
from guardian.shortcuts import assign_perm, remove_perm

@receiver(signal=post_save, sender=Form)
def assign_form_permission(instance, created, **kwargs):
  if created:
    group = instance.organization.hr_group.group
    assign_perm("forms.manage_form", group, instance)


@receiver(signal=pre_delete, sender=Form)
def remove_form_permission(instance, **kwargs):
  group = instance.organization.hr_group.group
  remove_perm("forms.manage_form", group, instance)