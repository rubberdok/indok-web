import graphene
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, User
from django.utils.text import slugify
from graphql_jwt.decorators import permission_required

from apps.permissions.models import ResponsibleGroup

from ..users.types import UserType
from . import permissions as perms
from .models import Membership, Organization
from .types import MembershipType, OrganizationType


class OrganizationInput(graphene.InputObjectType):
    name = graphene.String(required=False)
    description = graphene.String(required=False)
    parent_id = graphene.ID(required=False)


class CreateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)
    ok = graphene.Boolean()

    class Arguments:
        organization_data = OrganizationInput(required=True)

    def mutate(self, info, organization_data):
        organization = Organization()

        for k, v in organization_data.items():
            setattr(organization, k, v)

        setattr(organization, "slug", slugify(organization.name))
        organization.save()
        ok = True
        return CreateOrganization(organization=organization, ok=ok)


class UpdateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        organization_data = OrganizationInput(required=False)

    @permission_required("organizations.change_organization")
    def mutate(self, info, id, organization_data=None):
        organization = Organization.objects.get(pk=id)
        user: User = info.context.user

        perms.check_user_membership(user, organization)

        for k, v in organization_data.items():
            setattr(organization, k, v)

        organization.save()
        ok = True
        return UpdateOrganization(organization=organization, ok=ok)


class DeleteOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    @permission_required("organizations.delete_organization")
    def mutate(self, info, id):
        organization = Organization.objects.get(pk=id)
        organization.delete()

        ok = True
        return DeleteOrganization(ok=ok)


class MembershipInput(graphene.InputObjectType):
    user_id = graphene.ID()
    organization_id = graphene.ID()
    group_id = graphene.ID()


class AssignMembership(graphene.Mutation):
    membership = graphene.Field(MembershipType)
    ok = graphene.Boolean()

    class Arguments:
        membership_data = MembershipInput(required=True)

    def mutate(self, info, membership_data):
        user = get_user_model().objects.get(pk=membership_data["user_id"])
        group = ResponsibleGroup.objects.get(pk=membership_data["group_id"])
        membership = Membership(
            organization_id=membership_data["organization_id"],
            user=user,
            group=group,
        )
        membership.save()
        user.groups.add(group.group)
        return AssignMembership(membership=membership, ok=True)


class RemoveMembership(graphene.Mutation):
    removed_member = graphene.Field(UserType)
    ok = graphene.Boolean()

    class Arguments:
        member_id = graphene.ID()

    def mutate(self, info, member_id):
        raise NotImplementedError("Denne funksjonaliteten er ikke implementert.")
        membership = Membership.objects.get(pk=member_id)
        user: User = membership.user
        membership.delete()
        return RemoveMembership(removed_member=user, ok=True)
