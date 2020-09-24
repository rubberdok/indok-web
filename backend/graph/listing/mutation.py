import graphene

from graph.listing.types import ListingType
from listing.models import Listing as Listing

class CreateListing(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

        start_date_time = graphene.DateTime()
        end_date_time = graphene.DateTime()

    ok = graphene.Boolean()
    listing = graphene.Field(lambda: ListingType)

    @classmethod
    def mutate(cls, root, info, title, description, url, start_date_time, end_date_time):
        listing = Listing(
            title=title,
            description=description,
            url=url,
            start_date_time=start_date_time,
            end_date_time=end_date_time
        )
        listing.save()
        ok = True
        return cls(listing=listing, ok=ok)

class DeleteListing(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    listing = graphene.Field(ListingType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        listing = Listing.objects.get(pk=kwargs["id"])
        listing.delete()
        ok = True
        return cls(ok=ok)

class ListingInput(graphene.InputObjectType):
    title = graphene.String(required=False)
    description = graphene.String(required=False)
    start_date_time = graphene.DateTime(required=False)
    end_date_time = graphene.DateTime(required=False)
    url = graphene.String(required=False)


class UpdateListing(graphene.Mutation):
    listing = graphene.Field(ListingType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        listing_data = ListingInput(required=False)

    @classmethod
    def mutate(cls, root, info, id, listing_data=None):
        listing = Listing.objects.get(pk=id)

        for k, v in listing_data.items():
            setattr(listing, k, v)

        listing.save()
        ok = True
        return cls(listing=listing, ok=ok)


class ListingMutations(graphene.ObjectType):
    create_listing = CreateListing.Field()
    delete_listing = DeleteListing.Field()
    update_listing = UpdateListing.Field()