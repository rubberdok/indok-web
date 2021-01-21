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
    listings = graphene.List(ListingType, search=graphene.String(required=False))
    listing = graphene.Field(ListingType, id=graphene.ID())

    response = graphene.Field(ResponseType, id=graphene.ID(required=False), listing_id=graphene.ID(required=False))

class ListingMutations(graphene.ObjectType):
    create_listing = CreateListing.Field()
    update_listing = UpdateListing.Field()
    delete_listing = DeleteListing.Field()

    create_response = CreateResponse.Field()
    update_response = UpdateResponse.Field()
    delete_response = DeleteResponse.Field()