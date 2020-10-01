from apps.listing.models import Listing


class ListingResolvers:
    def resolve_all_listings(parent, info, **kwargs):
        return Listing.objects.all()

    def resolve_listing_by_id(parent, info, id):
        try:
            return Listing.objects.get(pk=id)
        except Listing.DoesNotExist:
            return None