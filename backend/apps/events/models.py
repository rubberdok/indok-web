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
    description = models.TextField()
    start_time = models.DateTimeField()
    is_attendable = models.BooleanField()
    publisher = models.CharField(max_length=128)

    # Optional fields
    end_time = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=128, blank=True, null=True)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, blank=True, null=True
    )
    category = models.ForeignKey(
        Category, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    image = models.URLField(blank=True, null=True)
    deadline = models.DateTimeField(blank=True, null=True)

    # TODO: Integrate when models are finished
    # author = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.title
