from typing import Optional
import graphene
from graphene import NonNull

from apps.permissions.types import ResponsibleGroupType
from .models import Organization, Membership
from graphene_django import DjangoObjectType
from decorators import login_required, PermissionDenied
from apps.users.permissions import can_manage_user_profiles

from ..listings.types import ListingType
from .dataloader import ListingsByOrganizationIdLoader


class OrganizationType(DjangoObjectType):
    absolute_slug = graphene.String()
    listings = graphene.List(NonNull(ListingType))
    primary_group = graphene.Field(source="primary_group", type_=ResponsibleGroupType)
    hr_group = graphene.Field(source="hr_group", type_=ResponsibleGroupType)
    permission_groups = graphene.List(NonNull(ResponsibleGroupType))

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
            "permission_groups",
        ]

    @staticmethod
    def resolve_listings(root: Organization, info):
        listing_loader = ListingsByOrganizationIdLoader()
        return listing_loader.load(root.id)

    @staticmethod
    def resolve_permission_groups(root: Organization, info):
        return root.permission_groups.all()

    class PermissionDecorators:
        @staticmethod
        def is_in_organization(resolver):
            def wrapper(organization: Organization, info):
                if organization.users.filter(pk=info.context.user.id).exists() or can_manage_user_profiles(
                    info.context.user
                ):
                    return resolver(organization, info)
                else:
                    raise PermissionDenied(
                        f"Du må være medlem av foreningen {organization.name} for å gjøre dette kallet"
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
        fields = ["id", "group", "organization", "user"]

    class PermissionDecorators:
        @staticmethod
        def is_in_organization(resolver):
            def wrapper(membership: Membership, info):
                if membership.organization.users.filter(pk=info.context.user.id).exists() or can_manage_user_profiles(
                    info.context.user
                ):
                    return resolver(membership, info)
                else:
                    raise PermissionDenied(
                        f"Du må være medlem av foreningen {membership.organization.name} for å gjøre dette kallet"
                    )

            return wrapper

    @PermissionDecorators.is_in_organization
    def resolve_user(membership, info):
        return membership.user
