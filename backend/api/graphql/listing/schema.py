import graphene

from .types import ListingType, ResponseType
from .mutations import (
    CreateListing,
    DeleteListing,
    UpdateListing,
    CreateResponse,
    UpdateResponse,
    DeleteResponse,
)
from .resolvers import ListingResolvers, ResponseResolvers

class ListingQueries(graphene.ObjectType, ListingResolvers, ResponseResolvers):
    all_listings = graphene.List(ListingType, search=graphene.String(required=False))
    listing_by_id = graphene.Field(ListingType, id=graphene.Int())

    responses_by_listing_id = graphene.List(ResponseType, id=graphene.ID())


class ListingMutations(graphene.ObjectType):
    create_listing = CreateListing.Field()
    update_listing = UpdateListing.Field()
    delete_listing = DeleteListing.Field()

    create_response = CreateResponse.Field()
    update_response = UpdateResponse.Field()
    delete_response = DeleteResponse.Field()