from django.db import models
from django.utils import timezone

from apps.organizations.models import Organization
from apps.forms.models import Form


class Listing(models.Model):
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=255, allow_unicode=True, blank=True, default="")
    description = models.CharField(max_length=2000, blank=True, default="")
    case = models.BooleanField(default=False)
    application = models.BooleanField(default=False)
    interview = models.BooleanField(default=False)

    start_datetime = models.DateTimeField(default=timezone.now)
    end_datetime = models.DateTimeField()
    deadline = models.DateTimeField()

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, null=True, related_name="listings"
    )

    url = models.URLField(null=True, blank=True)

    form = models.ForeignKey(Form, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.title} (Open: {self.start_datetime} - {self.end_datetime}: {self.description}"

    def __repl__(self):
        return self.__str__()

    class Meta:
        ordering = ["-deadline"]
