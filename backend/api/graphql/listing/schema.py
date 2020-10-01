import graphene

from .types import ListingType
from .mutations import CreateListing, DeleteListing, UpdateListing

from apps.listing.models import Listing

class ListingQueries(graphene.ObjectType):
    all_listings = graphene.List(ListingType)
    listing_by_id = graphene.Field(ListingType, id=graphene.Int())

    def resolve_all_listings(root, info, **kwargs):
        return Listing.objects.all()

    def resolve_listing_by_id(root, info, id):
        try:
            return Listing.objects.get(pk=id)
        except Listing.DoesNotExist:
            return None

class ListingMutations(graphene.ObjectType):
    create_listing = CreateListing.Field()
    update_listing = UpdateListing.Field()
    delete_listing = DeleteListing.Field()