from django.db import models
from django.db.models import UniqueConstraint

from apps.users.models import User
from apps.listing.models import Listing

# Create your models here.
class ListingResponse(models.Model):
    applicant = models.ForeignKey(User, blank=False, null=False, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, blank=False, null=False, on_delete=models.CASCADE)
    response = models.CharField(max_length=5000)

    class Meta:
        UniqueConstraint(fields=['applicant', 'listing'], name="unique_listing_response_for_listing")
