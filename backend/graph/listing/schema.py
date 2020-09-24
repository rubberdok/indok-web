import graphene

from graph.listing.types import ListingType
from listing.models import Listing as ListingModel

from .mutation import ListingMutations

class ListingQuery(graphene.ObjectType):
    all_listings = graphene.List(ListingType)
    listing_by_id = graphene.Field(ListingType, id=graphene.String())

    def resolve_all_listings(root, info, **kwargs):
        return ListingModel.objects.all()

    def resolve_listing_by_id(root, info, id):
        listing = ListingModel.objects.get(pk=id)
        if listing is None:
            return None
        return listing

class Mutation(ListingMutations):
    pass

class Query(ListingQuery):
    pass