from apps.listing.models import Listing

def resolve_all_listings(root, info):
    return Listing.objects.all()

def resolve_listing_by_id(root, info, id):
    try:
        return Listing.objects.get(pk=id)
    except Listing.DoesNotExist:
        return None