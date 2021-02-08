from apps.organizations.models import Organization, Membership, Role
from django.db.models import Q


class OrganizationResolvers:
    def resolve_all_organizations(self, info, search=None):
        if search:
            filter = Q(name__icontains=search)
            return Organization.objects.filter(filter)
        return Organization.objects.all()

    def resolve_organization(self, info, id):
        try:
            return Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return None

    def resolve_event_filtered_organizations(self, info):
        try:
            return Organization.objects.filter(parent=None)

        except Organization.DoesNotExist:
            return None


class MemberResolvers:
    def resolve_all_memberships(self, info):
        return Membership.objects.all()

    def resolve_all_rolves(self, info):
        return Role.objects.all()