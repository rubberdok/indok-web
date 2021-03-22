from django.db import models
from django.utils import timezone

from apps.organizations.models import Organization
from apps.surveys.models import Survey


class Listing(models.Model):
    description = models.CharField(max_length=2000, blank=True, default="")
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=255, allow_unicode=True, blank=True, default="")

    start_datetime = models.DateTimeField(default=timezone.now)
    end_datetime = models.DateTimeField()
    deadline = models.DateTimeField()

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, related_name="listings")

    url = models.URLField(null=True, blank=True)

    survey = models.ForeignKey(Survey, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.title} (Open: {self.start_datetime} - {self.end_datetime}: {self.description}"

    def __repl__(self):
        return self.__str__()
