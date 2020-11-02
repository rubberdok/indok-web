from django.db import models
from django.db.models import UniqueConstraint

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

    class Meta:
        UniqueConstraint(
            fields=["parent", "name"], name="unique_child_organization_name"
        )

    def __str__(self):
        return f"{self.name}"
