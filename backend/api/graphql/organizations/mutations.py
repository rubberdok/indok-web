from logging import log
import graphene

from django.utils.text import slugify
from django.contrib.auth.models import Group
from guardian.decorators import permission_required
from graphql_jwt.decorators import login_required, user_passes_test

from .types import OrganizationType
from apps.organizations.models import Organization

class OrganizationInput(graphene.InputObjectType):
    name = graphene.String(required=False)
    description = graphene.String(required=False)
    parent_id = graphene.ID(required=False)


class CreateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)
    ok = graphene.Boolean()

    class Arguments:
        organization_data = OrganizationInput(required=True)

    @classmethod
    @login_required
    def mutate(cls, root, info, organization_data):
        organization = Organization()

        for k, v in organization_data.items():
            setattr(organization, k, v)

        setattr(organization, "slug", slugify(organization.name))
        organization.save()
        Group.objects.create(name=organization.name)
        ok = True
        return cls(organization=organization, ok=ok)

class UpdateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        organization_data = OrganizationInput(required=False)


    @classmethod
    def mutate(cls, root, info, id, organization_data=None):
        organization = Organization.objects.get(pk=id)

        for k, v in organization_data.items():
            setattr(organization, k, v)

        organization.save()
        ok = True
        return cls(organization=organization, ok=ok)

class DeleteOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    @classmethod
    def mutate(cls, root, info, id):
        organization = Organization.objects.get(pk=id)
        organization.delete()
        
        ok = True
        return cls(ok=ok)
