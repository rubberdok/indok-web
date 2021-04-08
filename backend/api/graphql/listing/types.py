from apps.listing.models import Listing
from graphene_django import DjangoObjectType


class ListingType(DjangoObjectType):
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
            "form",
        ]
