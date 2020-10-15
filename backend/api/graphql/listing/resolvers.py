from apps.listing.models import Listing, Response
from django.db.models import Q

class ListingResolvers:
    def resolve_listings(parent, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(organization__name__icontains=search)
            )
            return Listing.objects.filter(filter)
        return Listing.objects.all()

    def resolve_listing(parent, info, id):
        try:
            return Listing.objects.get(pk=id)
        except Listing.DoesNotExist:
            return None


class ResponseResolvers:
    def resolve_response(root, info, id):
        return Response.objects.get(pk=id)