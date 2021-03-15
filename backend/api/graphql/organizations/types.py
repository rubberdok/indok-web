import graphene
from apps.organizations.models import Organization, Membership, Role
from graphene_django import DjangoObjectType

from ..listing.types import ListingType
from .dataloader import ListingsByOrganizationIdLoader


class OrganizationType(DjangoObjectType):
    absolute_slug = graphene.String()
    listings = graphene.List(ListingType)

    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "color", "description", "parent", "children"]

    @staticmethod
    def resolve_listings(root: Organization, info):
        listing_loader = ListingsByOrganizationIdLoader()
        return listing_loader.load(root.id)
    
    @staticmethod
    def resolve_absolute_slug(organization: Organization, info):
        slug_list = [organization.slug]
        while (organization := organization.parent) and organization.parent != organization:
            print(slug_list)
            slug_list.insert(0, organization.slug)
        return "/".join(slug_list)



class MembershipType(DjangoObjectType):
    class Meta:
        model = Membership


class RoleType(DjangoObjectType):
    class Meta:
        model = Role
        
