from graphene_django import DjangoObjectType

from apps.organizations.models import Organization


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
<<<<<<< HEAD
        fields = ["id", "name", "slug", "description", "parent", "children"]
=======
        fields = ["id", "name", "slug", "color", "description", "parent", "children"]
>>>>>>> b022cc55f830c6d4c6dcfb09d1783b9fd266b2e4
