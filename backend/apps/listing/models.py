from django.db import models
from django.db.models import UniqueConstraint
import uuid

from apps.organizations.models import Organization
from apps.users.models import User
from apps.surveys.models import Survey
# Create your models here.

class Listing(models.Model):
    description = models.CharField(max_length=2000, blank=True, default="")
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=255, allow_unicode=True, blank=True, default="")

    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    deadline = models.DateTimeField()

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, related_name="listings")

    url = models.URLField(null=True, blank=True)

    survey = models.ForeignKey(Survey, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.title} (Open: {self.start_datetime} - {self.end_datetime}: {self.description}"

    def __repl__(self):
        return self.__str__()

class Response(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    applicant = models.ForeignKey(User, blank=False, null=False, on_delete=models.CASCADE, related_name="responses")
    listing = models.ForeignKey(Listing, blank=False, null=False, on_delete=models.CASCADE, related_name="responses")
    response = models.CharField(max_length=5000)

    class Meta:
        constraints = [UniqueConstraint(fields=['applicant', 'listing'], name="unique_listing_response_for_listing")]
        
