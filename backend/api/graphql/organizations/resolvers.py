from apps.organizations.models import Organization, Membership, Role
from django.db.models import Q
from typing import Optional


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
    def resolve_all_memberships(self, info):
        return Membership.objects.all()

    def resolve_all_rolves(self, info):
        return Role.objects.all()
