import graphene

from graphql.listing.types import ListingType
from listing.models import Listing as ListingModel

class CreateListing(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

        start_date_time = graphene.DateTime()
        end_date_time = graphene.DateTime()

    ok = graphene.Boolean()
    listing = graphene.Field(lambda: ListingType)

    @staticmethod
    def mutate(root, info, title, description, url, start_date_time, end_date_time):
        listing = ListingModel(
            title=title,
            description=description,
            url=url,
            start_date_time=start_date_time,
            end_date_time=end_date_time
        )
        listing.save()
        ok = True
        return CreateListing(listing=listing, ok=ok)