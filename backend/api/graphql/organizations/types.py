import graphene
from apps.organizations.models import Organization
from graphene_django import DjangoObjectType

from ..listing.types import ListingType
from .dataloader import ListingsByOrganizationIdLoader


class OrganizationType(DjangoObjectType):
    listings = graphene.List(ListingType)

    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "color", "description", "parent", "children"]

    @staticmethod
    def resolve_listings(root: Organization, info):
        listing_loader = ListingsByOrganizationIdLoader()
        return listing_loader.load(root.id)
