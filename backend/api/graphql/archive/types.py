import graphene
from apps.archive.models import ArchiveDocument
from graphene_django import DjangoObjectType


class ArchiveDocumentType(DjangoObjectType):
    class Meta:
        model = ArchiveDocument
