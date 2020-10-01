import graphene

from .types import ListingResponseType
from .mutations import CreateListingResponse, UpdateListingResponse, DeleteListingResponse
from .resolvers import ListingResponseResolvers

class ListingResponseQueries(graphene.ObjectType, ListingResponseResolvers):
    responses_by_listing_id = graphene.List(ListingResponseType, id=graphene.ID())

class ListingResponseMutations(graphene.ObjectType):
    create_listing_response = CreateListingResponse.Field()
    update_listing_response = UpdateListingResponse.Field()
    delete_listing_response = DeleteListingResponse.Field()