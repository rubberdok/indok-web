import graphene

from .mutations import (
    CreateListing,
    DeleteListing,
    UpdateListing
)
from .resolvers import ListingResolvers
from .types import ListingType


class ListingQueries(graphene.ObjectType, ListingResolvers):
    listings = graphene.List(ListingType, search=graphene.String(required=False))
    listing = graphene.Field(ListingType, id=graphene.ID())

class ListingMutations(graphene.ObjectType):
    create_listing = CreateListing.Field()
    update_listing = UpdateListing.Field()
    delete_listing = DeleteListing.Field()