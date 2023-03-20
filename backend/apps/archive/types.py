import graphene
from graphene_django import DjangoObjectType

from .models import ArchiveDocument


class ArchiveDocumentType(DjangoObjectType):
    thumbnail = graphene.String()

    class Meta:
        model = ArchiveDocument
