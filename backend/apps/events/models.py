# from django.contrib.auth import get_user_model
from apps.organizations.models import Organization
from django.db import models


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name

    class Meta:
        # Add verbose name
        verbose_name_plural = "Categories"


class Event(models.Model):
    # Mandatory fields
    title = models.CharField(max_length=128)
    starttime = models.DateTimeField()
    description = models.TextField()
    is_attendable = models.BooleanField()
    publisher = models.TextField()

    # Optional fields
    endtime = models.DateTimeField(blank=True, null=True)
    location = models.TextField(blank=True, default="")
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, blank=True, null=True
    )
    category = models.ForeignKey(
        Category, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    image = models.URLField(blank=True, default="")
    deadline = models.DateTimeField(blank=True, null=True)

    # TODO: Integrate when models are finished
    # author = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.title
