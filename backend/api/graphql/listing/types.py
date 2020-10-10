from graphene_django import DjangoObjectType
from .dataloader import ResponsesByListingIdLoader
import graphene

from apps.listing.models import Listing, Response


class ResponseType(DjangoObjectType):
    class Meta:
        model = Response
        fields = ['response', 'listing', 'applicant', 'id']

class ListingType(DjangoObjectType):
    responses = graphene.List(ResponseType)

    class Meta:
        model = Listing
        fields = [
            "id",
            "description",
            "title",
            "start_date_time",
            "end_date_time",
            "url",
            "slug",
            "deadline",
            "organization",
        ]

    @staticmethod
    def resolve_responses(root: Listing, info):
        response_loader = ResponsesByListingIdLoader()
        return response_loader.load(root.id)