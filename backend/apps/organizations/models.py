from django.conf import settings
from django.db import models
from django.db.models import UniqueConstraint

from apps.permissions.models import ResponsibleGroup


class Organization(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    description = models.TextField(blank=True)

    parent = models.ForeignKey(
        "Organization",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="children",
    )

    logo = models.ImageField(upload_to="organizations", blank=True, null=True)
    logo_url = models.URLField(null=True, blank=True)
    color = models.CharField(max_length=100, blank=True, null=True)

    # Permission groups
    # All members are added to the primary group
    # Members can be added to groups programatically
    # The HR-group has the "forms.manage_form" permission, allowing them to view and manage responses to e.g. listings.
    # The primary group is intended to act as a group for organizations who need any kind of
    # special permission, e.g. hyttestyret
    # Or if we wish to limit the creation of events or listings to certain organizations.

    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="organizations",
        blank=True,
        through="Membership",
        through_fields=("organization", "user"),
    )

    class Meta:
        constraints = [UniqueConstraint(fields=["parent", "name"], name="unique_child_organization_name")]
        # Permissions for adding objects tied to the organization
        permissions = (
            ("add_listing", "Add listing to organization"),
            ("add_form", "Add form to organization"),
            ("add_event", "Add event by organization"),
        )

    def __str__(self):
        return f"{self.name}"


class Membership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="memberships")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="members")
    groups = models.ManyToManyField(ResponsibleGroup, related_name="memberships", blank=True)

    class Meta:
        constraints = [UniqueConstraint(fields=["user", "organization"], name="unique_member_in_organization")]

    def __str__(self) -> str:
        return f"{self.organization.name}:{self.user.username}"
