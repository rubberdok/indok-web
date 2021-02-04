from graphene_django import DjangoObjectType

from apps.organizations.models import Organization, Member, Role


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "color", "description", "parent", "children"]


class MemberType(DjangoObjectType):
    class Meta:
        model = Member


class RoleType(DjangoObjectType):
    class Meta:
        model = Role
        