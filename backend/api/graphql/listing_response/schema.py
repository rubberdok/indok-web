import graphene

from .types import ListingResponseType
from .mutations import CreateListingResponse, UpdateListingResponse, DeleteListingResponse

from apps.listing.models import Listing
from apps.listing_response.models import ListingResponse

class ListingResponseQueries(graphene.ObjectType):
    responses_by_listing_id = graphene.List(ListingResponseType, id=graphene.ID())

    def resolve_responses_by_listing_id(root, info, id):
        return Listing.objects.get(pk=id).listingresponse_set.all()

    def resolve_reponse_by_id(root, info, id):
        return ListingResponse.objects.get(pk=1)

    def resolve_all_respones(root, info, id):
        return ListingResponse.objects.all()


class ListingResponseMutations(graphene.ObjectType):
    create_listing_response = CreateListingResponse.Field()
    update_listing_response = UpdateListingResponse.Field()
    delete_listing_response = DeleteListingResponse.Field()