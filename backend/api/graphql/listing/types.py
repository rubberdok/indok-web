from graphene_django import DjangoObjectType

from apps.listing.models import Listing as ListingModel

class ListingType(DjangoObjectType):
    class Meta:
        model = ListingModel
        fields = ("id", "description", "title", "start_date_time", "end_date_time", "url", "slug")