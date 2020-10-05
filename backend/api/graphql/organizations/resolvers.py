from apps.organizations.models import Organization

class OrganizationResolvers:
    def resolve_all_organizations(root, info, search=None):
        return Organization.objects.all()

    def resolve_organization(root, info, id):
        try:
            return Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return None
