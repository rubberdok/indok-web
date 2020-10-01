import graphene

from .mutations import CreateOrganization, UpdateOrganization, DeleteOrganization
from .types import OrganizationType

from apps.organizations.models import Organization

class OrganizationMutations(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    delete_organization = DeleteOrganization.Field()

class OrganizationQueries(graphene.ObjectType):
    all_organizations = graphene.List(OrganizationType)
    organization = graphene.Field(OrganizationType, id=graphene.ID(required=True))

    def resolve_all_organizations(root, info):
        return Organization.objects.all()

    def resolve_organization(root, info, id):
        try:
            return Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return None