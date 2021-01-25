from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test
from .dataloader import ResponsesByListingIdLoader
import graphene

from apps.listing.models import Listing, Response
from graphql_jwt.decorators import permission_required

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
            "survey",
        ]

    @staticmethod
    @permission_required(["listing.view_responses"])
    def resolve_responses(root: Listing, info): 
        """
        TODO: ensure that the user belongs to the same organization as the origins of the listing.
        """
        user = info.context.user
        response_loader = ResponsesByListingIdLoader()
        return response_loader.load(root.id)