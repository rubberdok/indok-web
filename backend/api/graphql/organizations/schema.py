import graphene
from .mutations import CreateOrganization, UpdateOrganization, DeleteOrganization
from .types import OrganizationType
from .resolvers import OrganizationResolvers
from django.db.models import Q
from apps.organizations.models import Organization


class OrganizationMutations(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    delete_organization = DeleteOrganization.Field()


class OrganizationQueries(graphene.ObjectType, OrganizationResolvers):
    all_organizations = graphene.List(OrganizationType, search=graphene.String())
    organization = graphene.Field(OrganizationType, id=graphene.ID(required=True))
    event_filtered_organizations = graphene.List(OrganizationType)
