import graphene
from .mutations import CreateOrganization, UpdateOrganization, DeleteOrganization, CreateRole, AssignMembership, RemoveMembership
from .types import OrganizationType, MembershipType, RoleType
from .resolvers import OrganizationResolvers, MembershipResolvers
from django.db.models import Q


class OrganizationMutations(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    delete_organization = DeleteOrganization.Field()

    create_role = CreateRole.Field()
    assign_member = AssignMembership.Field()
    remove_member = RemoveMembership.Field()


class OrganizationQueries(graphene.ObjectType, OrganizationResolvers, MembershipResolvers):
    all_organizations = graphene.List(OrganizationType, search=graphene.String())
    organization = graphene.Field(OrganizationType, id=graphene.ID(required=True))
    event_filtered_organizations = graphene.List(OrganizationType)

    all_memberships = graphene.List(MembershipType)
    all_roles = graphene.List(RoleType)
