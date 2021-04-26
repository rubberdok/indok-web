from typing import Optional

from django.db.models import Q

from .models import Membership, Organization


class OrganizationResolvers:
    def resolve_all_organizations(self, info, search=None):
        if search:
            filter = Q(name__icontains=search)
            return Organization.objects.filter(filter)
        return Organization.objects.all()

    def resolve_organization(self, info, id=None, slug=None):
        try:
            if id:
                return Organization.objects.get(pk=id)
            if slug:
                return _get_organization_from_slug(slug)
        except Organization.DoesNotExist:
            return None

    def resolve_event_filtered_organizations(self, info):
        try:
            return Organization.objects.filter(parent=None)

        except Organization.DoesNotExist:
            return None


def _get_organization_from_slug(slug: str) -> Optional[Organization]:
    slugs = slug.strip("/").split("/")
    organization = Organization.objects.filter(slug=slugs[0], parent=None).first()
    if len(slugs) >= 2:
        for slug in slugs[1:]:
            organization = organization.children.filter(slug=slug).first()
    return organization


class MembershipResolvers:
    def resolve_memberships(self, info, organization_id):
        organization = Organization.objects.get(pk=organization_id)
        if organization.users.filter(user=info.context.user).exists():
            return Membership.objects.filter(organization=organization)
        raise PermissionError(
            f"Du må være medlem av {organization} for å gjøre dette kallet."
        )
