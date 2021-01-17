import graphene
from graphene import ObjectType
from apps.archive.models import ArchiveDocument
from graphene_django import DjangoObjectType
from apps.archive.google_drive_api import get_url, get_thumbnail


class ArchiveDocumentType(DjangoObjectType):
    url = graphene.String()
    thumbnail = graphene.String()

    class Meta:
        model = ArchiveDocument

    @staticmethod
    def resolve_url(root: ArchiveDocument, info):
        return f"{get_url(root.file_location)}"

    @staticmethod
    def resolve_thumbnail(root: ArchiveDocument, info):
        return f"{get_thumbnail(root.file_location)}"
