import graphene

from django.utils.text import slugify

from .types import ListingType
from apps.listing.models import Listing as Listing

class ListingInput(graphene.InputObjectType):
    title = graphene.String(required=False)
    description = graphene.String(required=False)
    start_date_time = graphene.DateTime(required=False)
    end_date_time = graphene.DateTime(required=False)
    deadline = graphene.DateTime(required=False)
    url = graphene.String(required=False)
    organization_id = graphene.ID(required=False)


class CreateListing(graphene.Mutation):
    ok = graphene.Boolean()
    listing = graphene.Field(ListingType)

    class Arguments:
        listing_data = ListingInput(required=True)

    @classmethod
    def mutate(cls, self, info, listing_data):
        listing = Listing()

        for k, v in listing_data.items():
            setattr(listing, k, v)

        setattr(listing, "slug", slugify(listing_data['title']))

        listing.save()
        ok = True
        return cls(listing=listing, ok=ok)

class DeleteListing(graphene.Mutation):
    ok = graphene.Boolean()
    listing_id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    @classmethod
    def mutate(cls, self, info, **kwargs):
        listing = Listing.objects.get(pk=kwargs["id"])
        listing_id = listing.id
        listing.delete()
        ok = True
        return cls(ok=ok, listing_id=listing_id)

class UpdateListing(graphene.Mutation):
    listing = graphene.Field(ListingType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        listing_data = ListingInput(required=False)

    @classmethod
    def mutate(cls, self, info, id, listing_data=None):
        listing = Listing.objects.get(pk=id)

        for k, v in listing_data.items():
            setattr(listing, k, v)

        listing.save()
        ok = True
        return cls(listing=listing, ok=ok)