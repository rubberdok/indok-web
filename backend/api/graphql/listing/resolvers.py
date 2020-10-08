from apps.listing.models import Listing, Response
from django.db.models import Q

class ListingResolvers:
    def resolve_all_listings(parent, info, search=None, **kwargs):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(organization__name__icontains=search)
            )
            return Listing.objects.filter(filter)
        return Listing.objects.all()

    def resolve_listing_by_id(parent, info, id):
        try:
            return Listing.objects.get(pk=id)
        except Listing.DoesNotExist:
            return None


class ResponseResolvers:
    def resolve_responses_by_listing_id(root, info, id, search=None):
        return Listing.objects.get(pk=id).response_set.all()

    def resolve_reponse_by_id(root, info, id):
        return Response.objects.get(pk=1)

    def resolve_all_respones(root, info, id):
        return Response.objects.all()