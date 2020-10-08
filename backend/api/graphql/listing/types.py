from graphene_django import DjangoObjectType

from apps.listing.models import Listing, Response


class ResponseType(DjangoObjectType):
    class Meta:
        model = Response
        fields = ['response', 'listing', 'applicant', 'id']

class ListingType(DjangoObjectType):
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
            "organization"
        ]