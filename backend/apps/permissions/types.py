import graphene
from graphene_django import DjangoObjectType

from .models import ResponsibleGroup


class ResponsibleGroupType(DjangoObjectType):
  id = graphene.ID(source="uuid", required=True)

  class Meta:
    model = ResponsibleGroup
    fields = ["uuid", "name", "description"]