from apps.listing.models import Listing
from apps.listing_response.models import ListingResponse


class ListingResponseResolvers:
    def resolve_responses_by_listing_id(root, info, id):
        return Listing.objects.get(pk=id).listingresponse_set.all()

    def resolve_reponse_by_id(root, info, id):
        return ListingResponse.objects.get(pk=1)

    def resolve_all_respones(root, info, id):
        return ListingResponse.objects.all()