from apps.listing.models import Listing
from django.db.models import Q
from django.utils import timezone


class ListingResolvers:
    def resolve_listings(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(organization__name__icontains=search)
            )
            return Listing.objects.filter(filter)
        return Listing.objects.filter(deadline__gte=timezone.now())

    def resolve_listing(self, info, id):
        try:
            return Listing.objects.get(pk=id)
        except Listing.DoesNotExist:
            return None
