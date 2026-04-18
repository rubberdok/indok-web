import graphene
from django.utils.text import slugify
from decorators import permission_required

from apps.users.types import UserType
from apps.permissions.models import ResponsibleGroup

from apps.organizations import permissions as perms
from apps.organizations.models import Membership, Organization
from apps.organizations.types import MembershipType, OrganizationType


def get_organization_from_data(*_, membership_data, **kwargs) -> Organization:
    return Organization.objects.get(pk=membership_data["organization_id"])


def get_organization_from_membership(*_, membership_id, **kwargs) -> Organization:
    membership = Membership.objects.select_related("organization").filter(pk=membership_id).first()
    return membership.organization if membership else None


class OrganizationInput(graphene.InputObjectType):
    name = graphene.String(required=False)
    description = graphene.String(required=False)
    parent_id = graphene.ID(required=False)


class CreateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)
    ok = graphene.Boolean()

    class Arguments:
        organization_data = OrganizationInput(required=True)

    @permission_required("organizations.add_organization")
    def mutate(self, _, organization_data):
        organization = Organization()

        for k, v in organization_data.items():
            setattr(organization, k, v)

        setattr(organization, "slug", slugify(organization.name))
        organization.save()
        return CreateOrganization(organization=organization, ok=True)


class UpdateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        organization_data = OrganizationInput(required=False)

    @permission_required("organizations.manage_organization")
    def mutate(self, info, id, organization_data=None):
        organization = Organization.objects.get(pk=id)
        user = info.context.user

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
    user_id = graphene.ID(required=True)
    organization_id = graphene.ID(required=True)
    group_id = graphene.ID(required=True)


class AssignMembership(graphene.Mutation):
    membership = graphene.Field(MembershipType)
    ok = graphene.Boolean()

    class Arguments:
        membership_data = MembershipInput(required=True)

    @permission_required("organizations.manage_organization", fn=get_organization_from_data)
    def mutate(self, _, membership_data):
        organization = Organization.objects.prefetch_related("permission_groups").get(
            pk=membership_data["organization_id"]
        )

        try:
            group = organization.permission_groups.get(pk=membership_data.get("group_id"))
        except ResponsibleGroup.DoesNotExist:
            return AssignMembership(membership=None, ok=False)

        membership = Membership(
            organization_id=membership_data["organization_id"],
            user_id=membership_data["user_id"],
            group=group,
        )
        membership.save()
        return AssignMembership(membership=membership, ok=True)


class UpsertMembership(graphene.Mutation):
    membership = graphene.Field(MembershipType)
    ok = graphene.Boolean()

    class Arguments:
        membership_data = MembershipInput(required=True)

    @permission_required("organizations.manage_organization", fn=get_organization_from_data)
    def mutate(self, _, membership_data):
        organization = Organization.objects.prefetch_related("permission_groups").get(
            pk=membership_data["organization_id"]
        )

        try:
            group = organization.permission_groups.get(pk=membership_data.get("group_id"))
        except ResponsibleGroup.DoesNotExist:
            return UpsertMembership(membership=None, ok=False)

        membership, _ = Membership.objects.update_or_create(
            organization_id=membership_data["organization_id"],
            user_id=membership_data["user_id"],
            defaults={"group": group},
        )
        return UpsertMembership(membership=membership, ok=True)


class RemoveMembership(graphene.Mutation):
    removed_member = graphene.Field(UserType)
    ok = graphene.Boolean()

    class Arguments:
        membership_id = graphene.ID(required=True)

    @permission_required("organizations.manage_organization", fn=get_organization_from_membership)
    def mutate(self, info, membership_id):
        membership = Membership.objects.select_related("user").filter(pk=membership_id).first()
        if membership is None:
            return RemoveMembership(removed_member=None, ok=False)

        removed_member = membership.user
        membership.delete()
        return RemoveMembership(removed_member=removed_member, ok=True)
