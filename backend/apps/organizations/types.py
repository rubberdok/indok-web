from typing import Optional
import graphene

from apps.permissions.types import ResponsibleGroupType
from .models import Organization, Membership
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from ..listings.types import ListingType
from .dataloader import ListingsByOrganizationIdLoader


class OrganizationType(DjangoObjectType):
    absolute_slug = graphene.String()
    listings = graphene.List(ListingType)
    primary_group = graphene.Field(source="primary_group", type=ResponsibleGroupType)
    hr_group = graphene.Field(source="hr_group", type=ResponsibleGroupType)

    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "slug",
            "color",
            "description",
            "parent",
            "children",
            "users",
            "events",
            "logo_url",
            "primary_group",
            "hr_group",
        ]

    @staticmethod
    def resolve_listings(root: Organization, info):
        listing_loader = ListingsByOrganizationIdLoader()
        return listing_loader.load(root.id)

    class PermissionDecorators:
        @staticmethod
        def is_in_organization(resolver):
            def wrapper(organization: Organization, info):
                if organization.users.filter(pk=info.context.user.id).exists():
                    return resolver(organization, info)
                else:
                    raise PermissionError(
                        f"Du må være medlem av organisasjonen {organization.name} for å gjøre dette kallet"
                    )

            return wrapper

    @staticmethod
    def resolve_absolute_slug(organization: Optional[Organization], _):
        if organization:
            slug_list = [organization.slug]
            while (organization := organization.parent) and organization.parent != organization:
                slug_list.insert(0, organization.slug)
            return "/".join(slug_list)

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_organization
    def resolve_users(organization: Organization, info):
        return organization.users

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_organization
    def resolve_events(organization: Organization, info):
        return organization.events


class MembershipType(DjangoObjectType):
    class Meta:
        model = Membership
        fields = ["id", "groups", "organization", "user"]

    class PermissionDecorators:
        @staticmethod
        def is_in_organization(resolver):
            def wrapper(membership: Membership, info):
                if membership.organization.users.filter(pk=info.context.user.id).exists():
                    return resolver(membership, info)
                else:
                    raise PermissionError(
                        f"Du må være medlem av organisasjonen {membership.organization.name} for å gjøre dette kallet"
                    )

            return wrapper

    @PermissionDecorators.is_in_organization
    def resolve_user(membership, info):
        return membership.user
