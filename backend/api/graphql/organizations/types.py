from graphene_django import DjangoObjectType

from apps.organizations.models import Organization, Membership, Role


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "color", "description", "parent", "children"]


class MembershipType(DjangoObjectType):
    class Meta:
        model = Membership


class RoleType(DjangoObjectType):
    class Meta:
        model = Role
        