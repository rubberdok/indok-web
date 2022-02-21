import graphene
from graphene_django import DjangoObjectType
from apps.users.types import UserType

from .models import ResponsibleGroup


class ResponsibleGroupType(DjangoObjectType):
    id = graphene.ID(source="uuid", required=True)
    users = graphene.List(graphene.NonNull(UserType), required=True)

    class Meta:
        model = ResponsibleGroup
        fields = ["uuid", "name", "description", "organization", "group_type"]

    def resolve_users(parent: ResponsibleGroup, info):
        return parent.group.user_set.all()
