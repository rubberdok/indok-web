from logging import log
import graphene

from django.utils.text import slugify
from django.contrib.auth.models import Group, User
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required, user_passes_test

from api.graphql.users.types import UserType
from .types import OrganizationType, MemberType, RoleType
from apps.organizations.models import Organization, Member, Role

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

class MemberInput(graphene.InputObjectType):
    user_id = graphene.ID()
    organization_id = graphene.ID()
    role = graphene.ID()

class AssignMember(graphene.Mutation):
    member = graphene.Field(MemberType)
    ok = graphene.Boolean()

    class Arugments:
        member_data = MemberInput(required=True)

    def mutate(self, info, member_data):
        member = Member(
            organization_id=member_data["organization_id"],
            member_id=member_data["member_id"],
            role_id=member_data["role_id"],
        )
        member.save()
        return AssignMember(member=member, ok=True)

class RemoveMember(graphene.Mutation):
    removed_member = graphene.Field(UserType)
    ok = graphene.Boolean()

    class Arugments:
        member_id = graphene.ID()

    def mutate(self, info, member_id):
        member = Member.objects.get(pk=member_id)
        user: User = member.user
        member.delete()
        return RemoveMember(removed_member=user, ok=True)

class RoleInput(graphene.InputObjectType):
    name = graphene.String()

class CreateRole(graphene.Mutation):
    role = graphene.Field(RoleType)
    ok = graphene.Boolean()

    class Arugments:
        role_data = RoleInput(required=True)
    
    def mutate(self, info, role_data):
        role = Role(name=role_data["name"])
        role.save()
        return CreateRole(role=role, ok=True)