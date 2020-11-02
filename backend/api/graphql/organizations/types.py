from graphene_django import DjangoObjectType

from apps.organizations.models import Organization


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "color", "description", "parent", "children"]
