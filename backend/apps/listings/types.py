from graphene_django import DjangoObjectType

from .models import Listing


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
