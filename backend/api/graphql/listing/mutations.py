import datetime
import graphene
from apps.listings.models import Listing
from django.utils.text import slugify
from graphql_jwt.decorators import login_required, permission_required

from .types import ListingType


class BaseListingInput(graphene.InputObjectType):
    title = graphene.String()
    description = graphene.String()
    start_datetime = graphene.DateTime()
    end_datetime = graphene.DateTime()
    deadline = graphene.DateTime()
    url = graphene.String()
    organization_id = graphene.ID()
    form_id = graphene.ID()


class CreateListingInput(BaseListingInput):
    title = graphene.String(required=True)
    organization_id = graphene.ID(required=True)
    deadline = graphene.DateTime(required=True)


class CreateListing(graphene.Mutation):
    """
    Creates a new listing
    """

    ok = graphene.Boolean()
    listing = graphene.Field(ListingType)

    class Arguments:
        listing_data = CreateListingInput(required=True)

    @login_required
    @permission_required("listing.add_listing")
    def mutate(self, info, listing_data):
        listing = Listing()

        for k, v in listing_data.items():
            setattr(listing, k, v)
        setattr(
            listing,
            "end_datetime",
            listing_data["deadline"] + datetime.timedelta(days=30),
        )
        setattr(listing, "slug", slugify(listing_data["title"]))

        listing.save()
        return CreateListing(listing=listing, ok=True)


class DeleteListing(graphene.Mutation):
    """
    Deletes the listing with the given ID
    """

    ok = graphene.Boolean()
    listing_id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required("listing.delete_listing")
    def mutate(self, info, **kwargs):
        try:
            listing = Listing.objects.get(pk=kwargs["id"])
        except Listing.DoesNotExist:
            return DeleteListing(ok=False, listing_id=kwargs["id"])
        listing_id = kwargs["id"]
        listing.delete()
        return DeleteListing(ok=True, listing_id=listing_id)


class UpdateListing(graphene.Mutation):
    listing = graphene.Field(ListingType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        listing_data = BaseListingInput(required=False)

    @login_required
    @permission_required("listing.update_listing")
    def mutate(self, info, id, listing_data=None):
        try:
            listing = Listing.objects.get(pk=id)
        except Listing.DoesNotExist:
            return UpdateListing(listing=None, ok=False)

        for k, v in listing_data.items():
            setattr(listing, k, v)

        listing.save()
        return UpdateListing(listing=listing, ok=True)
