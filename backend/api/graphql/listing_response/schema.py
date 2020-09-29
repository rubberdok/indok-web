import graphene

from .types import ListingResponseType
from .resolvers import resolve_responses_by_listing_id
from .mutations import CreateListingResponse, UpdateListingResponse, DeleteListingResponse

class ListingResponseQueries(graphene.ObjectType):
    responses_by_listing_id = graphene.List(ListingResponseType, id=graphene.ID())

    def resolve_responses_by_listing_id(root, info, id):
        return resolve_responses_by_listing_id(root, info, id)


class ListingResponseMutations(graphene.ObjectType):
    create_listing_response = CreateListingResponse.Field()
    update_listing_response = UpdateListingResponse.Field()
    delete_listing_response = DeleteListingResponse.Field()