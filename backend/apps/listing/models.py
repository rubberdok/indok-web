from django.db import models
from django.db.models import UniqueConstraint

from apps.organizations.models import Organization
from apps.users.models import User
# Create your models here.

class Listing(models.Model):
    description = models.CharField(max_length=2000, blank=True, default="")
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=255, allow_unicode=True, blank=True, default="")

    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()
    deadline = models.DateTimeField()

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)

    url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} (Open: {self.start_date_time} - {self.end_date_time}: {self.description}"

    def __repl__(self):
        return self.__str__()

class Response(models.Model):
    applicant = models.ForeignKey(User, blank=False, null=False, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, blank=False, null=False, on_delete=models.CASCADE)
    response = models.CharField(max_length=5000)

    class Meta:
        UniqueConstraint(fields=['applicant', 'listing'], name="unique_listing_response_for_listing")
