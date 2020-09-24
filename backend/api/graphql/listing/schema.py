import graphene

from .types import ListingType
from .resolvers import resolve_all_listings, resolve_listing_by_id
from .mutations import CreateListing, DeleteListing, UpdateListing

class ListingQueries(graphene.ObjectType):
    all_listings = graphene.List(ListingType)
    listing_by_id = graphene.Field(ListingType, id=graphene.String())

    def resolve_all_listings(root, info, **kwargs):
        return resolve_all_listings(root, info)

    def resolve_listing_by_id(root, info, id):
        return resolve_listing_by_id(root, info, id)

class ListingMutations(graphene.ObjectType):
    create_listing = CreateListing.Field()
    update_listing = UpdateListing.Field()
    delete_listing = DeleteListing.Field()