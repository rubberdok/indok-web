import graphene
from graphene_django import DjangoObjectType

from apps.listing_response.models import ListingResponse

class ListingResponseType(DjangoObjectType):
    class Meta:
        model = ListingResponse
        fields = ['response', 'listing', 'applicant', 'id']


