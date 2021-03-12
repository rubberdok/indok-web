import graphene

from .mutations import (
    AssignMembership,
    CreateOrganization,
    CreateRole,
    DeleteOrganization,
    RemoveMembership,
    UpdateOrganization,
)
from .resolvers import MembershipResolvers, OrganizationResolvers
from .types import MembershipType, OrganizationType, RoleType


class OrganizationMutations(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    delete_organization = DeleteOrganization.Field()

    create_role = CreateRole.Field()
    assign_membership = AssignMembership.Field()
    remove_membership = RemoveMembership.Field()


class OrganizationQueries(
    graphene.ObjectType, OrganizationResolvers, MembershipResolvers
):
    all_organizations = graphene.List(OrganizationType, search=graphene.String())
    organization = graphene.Field(
        OrganizationType,
        id=graphene.ID(required=False),
        slug=graphene.String(required=False),
    )
    event_filtered_organizations = graphene.List(OrganizationType)

    all_memberships = graphene.List(MembershipType)
    all_roles = graphene.List(RoleType)
