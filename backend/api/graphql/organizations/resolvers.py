from apps.organizations.models import Organization
from django.db.models import Q


class OrganizationResolvers:
    def resolve_all_organizations(root, info, search=None):
        if search:
            filter = Q(name__icontains=search)
            return Organization.objects.filter(filter)
        return Organization.objects.all()

    def resolve_organization(root, info, id):
        try:
            return Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return None

    def resolve_event_filtered_organizations(root, info):
        try:
            return Organization.objects.filter(parent=None)

        except Organization.DoesNotExist:
            return None