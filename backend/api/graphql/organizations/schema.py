import graphene
from .mutations import CreateOrganization, UpdateOrganization, DeleteOrganization, CreateRole, AssignMember, RemoveMember
from .types import OrganizationType, MembershipType, RoleType
from .resolvers import OrganizationResolvers, MemberResolvers
from django.db.models import Q


class OrganizationMutations(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    delete_organization = DeleteOrganization.Field()

    create_role = CreateRole.Field()
    assign_member = AssignMember.Field()
    remove_member = RemoveMember.Field()


class OrganizationQueries(graphene.ObjectType, OrganizationResolvers, MemberResolvers):
    all_organizations = graphene.List(OrganizationType, search=graphene.String())
    organization = graphene.Field(OrganizationType, id=graphene.ID(required=True))
    event_filtered_organizations = graphene.List(OrganizationType)

    all_memberships = graphene.List(MembershipType)
    all_roles = graphene.List(RoleType)
