from django.db.models.signals import post_save
from django.dispatch import receiver
from guardian.shortcuts import assign_perm

from apps.forms.models import Form


@receiver(post_save, sender=Form)
def handle_new_form(sender, instance: Form, created: bool, **kwargs) -> None:
    if created:
        perms = ["forms.manage_form", "forms.change_form", "forms.delete_form"]
        group = instance.organization.hr_group.group
        for perm in perms:
            assign_perm(perm, group, instance)
