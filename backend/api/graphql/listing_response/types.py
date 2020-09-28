import graphene
from graphene_django import DjangoObjectType
from graphene import relay

from apps.listing_reponse.models import ListingResponse

class ListingResponseType(DjangoObjectType):
    class Meta:
        model = ListingResponse
        filter_fields = ['applicant', 'listing', 'response']
        instance = (relay.Node, )
