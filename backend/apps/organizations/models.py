from django.db import models
from django.db.models import UniqueConstraint
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, User
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

# Create your models here.
class Organization(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True, default="")
    description = models.CharField(max_length=4000, blank=True)

    parent = models.ForeignKey(
        "Organization",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="children",
    )

    logo = models.ImageField(upload_to="organizations", blank=True, null=True)
    color = models.CharField(max_length=100, blank=True, null=True)

    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True)

    class Meta:
        constraints = [UniqueConstraint(
            fields=["parent", "name"], name="unique_child_organization_name"
        )]

    def __str__(self):
        return f"{self.name}"


class Member(models.Model):
    member = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="memberships")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="members")
    role = models.ForeignKey("Role", on_delete=models.DO_NOTHING)

    class Meta:
        constraints = [UniqueConstraint(
            fields=["member", "organization"], name="unique_member_in_organization"
        )]

    def __str__(self) -> str:
        return f"{self.organization.name}:{self.member.username}" 

class Role(models.Model):
    name = models.TextField(max_length=50, default="Medlem", null=False)
    


@receiver(post_save, sender=Member)
def handle_new_member(sender, **kwargs):
    member: Member = kwargs["instance"]
    group: Group = member.organization.group
    if group:
        user: User = member.member
        user.groups.add(group)
        user.save()


@receiver(pre_delete, sender=Member)
def handle_removed_memeber(sender, **kwargs):
    member: Member = kwargs["instance"]
    group: Group = member.organization.group
    if group:
        user: User = member.member
        user.groups.remove(group)