import graphene

from .types import ListingType
from .mutations import CreateListing, DeleteListing, UpdateListing
from .resolvers import ListingResolvers

class ListingQueries(graphene.ObjectType, ListingResolvers):
    all_listings = graphene.List(ListingType)
    listing_by_id = graphene.Field(ListingType, id=graphene.Int())

class ListingMutations(graphene.ObjectType):
    create_listing = CreateListing.Field()
    update_listing = UpdateListing.Field()
    delete_listing = DeleteListing.Field()