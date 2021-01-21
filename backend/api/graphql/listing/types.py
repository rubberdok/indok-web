from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test
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
            "start_datetime",
            "end_datetime",
            "url",
            "slug",
            "deadline",
            "organization",
        ]

    @staticmethod
    @user_passes_test(lambda user: user.is_staff)
    def resolve_responses(root: Listing, info):
        response_loader = ResponsesByListingIdLoader()
        return response_loader.load(root.id)