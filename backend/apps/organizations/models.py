from django.db import models
from django.db.models import UniqueConstraint
from django.contrib.auth import get_user_model

# Create your models here.
class Organization(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True, default="")
    description = models.CharField(max_length=4000, blank=True)

    members = models.ManyToManyField(get_user_model(), through="Members")

    parent = models.ForeignKey(
        "Organization",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="children",
    )

    logo = models.ImageField(upload_to="organizations", blank=True, null=True)

    color = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        UniqueConstraint(
            fields=["parent", "name"], name="unique_child_organization_name"
        )

    def __str__(self):
        return f"{self.name}"


class Members(models.Model):
    member = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    role = models.ForeignKey("Role", on_delete=models.DO_NOTHING)

    class Meta:
        constraints = UniqueConstraint(
            fields=["member", "organization"], name="unique_member_in_organization"
        )

    def __str__(self) -> str:
        return f"{self.organization.name}:{self.member.username}" 

class Role(models.Model):
    name = models.TextField(max_length=50, default="Medlem", null=False)
    
