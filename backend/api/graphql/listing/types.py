from graphene_django import DjangoObjectType
from graphene import relay

from apps.listing.models import Listing as Listing

class ListingType(DjangoObjectType):
    class Meta:
        model = Listing
        fields = ["id", "description", "title", "start_date_time", "end_date_time", "url", "slug", "deadline"]