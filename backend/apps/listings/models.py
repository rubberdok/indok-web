from django.db import models
from django.utils import timezone

from apps.organizations.models import Organization
from apps.forms.models import Form


class Listing(models.Model):
    # Basic information
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True, default="")

    # View count for the specific listing, updated on every call
    view_count = models.IntegerField(default=0)

    # Application process indicators
    # TODO switch to comma separated charfield
    case = models.BooleanField(default=False)
    application = models.BooleanField(default=False)
    interview = models.BooleanField(default=False)

    # Dates
    start_datetime = models.DateTimeField(default=timezone.now)
    end_datetime = models.DateTimeField()
    deadline = models.DateTimeField()

    # URLs
    url = models.URLField(null=True, blank=True)
    read_more = models.URLField(null=True, blank=True)

    # Auto fields
    form = models.OneToOneField(Form, null=True, on_delete=models.SET_NULL)
    slug = models.SlugField(max_length=50, allow_unicode=True, blank=True, default="")
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="listings"
    )

    def __str__(self):
        return f"{self.title} (Open: {self.start_datetime} - {self.end_datetime}: {self.description}"

    def __repl__(self):
        return self.__str__()

    class Meta:
        ordering = ["deadline"]
