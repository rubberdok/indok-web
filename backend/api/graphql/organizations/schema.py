import graphene
from django.db.models import Q

from .mutations import CreateOrganization, UpdateOrganization, DeleteOrganization
from .types import OrganizationType

from apps.organizations.models import Organization


class OrganizationMutations(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    delete_organization = DeleteOrganization.Field()


class OrganizationQueries(graphene.ObjectType):
    all_organizations = graphene.List(OrganizationType, search=graphene.String())
    organization = graphene.Field(OrganizationType, id=graphene.ID(required=True))
    event_filtered_organizations = graphene.List(OrganizationType)

    def resolve_all_organizations(root, info, search=None):
        if search:
            filter = Q(name__icontains=search)
            return Organization.objects.filter(filter)
        return Organization.objects.all()

    def resolve_organization(root, info, id):
        try:
            return Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return None

    def resolve_event_filtered_organizations(root, info):
        try:
            return Organization.objects.filter(parent=None)

        except Organization.DoesNotExist:
            return None
