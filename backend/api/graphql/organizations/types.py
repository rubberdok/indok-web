from graphene_django import DjangoObjectType

from apps.organizations.models import Organization

class OrganizationType(DjangoObjectType):
    class meta:
        model = Organization
        fields = ['id', 'name', 'slug']