from django.db.models import Q, F
from django.utils import timezone

from .models import Listing


class ListingResolvers:
    def resolve_listings(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(organization__name__icontains=search)
            )
            return Listing.objects.filter(filter)
        return Listing.objects.filter(
            Q(deadline__gte=timezone.now()) & Q(start_datetime__lte=timezone.now())
        )

    def resolve_listing(self, info, id):
        try:
            listing = Listing.objects.get(pk=id)
            listing.view_count = F("view_count") + 1
            listing.save()
            listing.refresh_from_db()
            return listing
        except Listing.DoesNotExist:
            return None
