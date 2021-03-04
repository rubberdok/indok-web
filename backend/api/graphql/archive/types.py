import graphene
from apps.archive.google_drive_api import get_thumbnail, get_url
from apps.archive.models import ArchiveDocument
from graphene_django import DjangoObjectType


class ArchiveDocumentType(DjangoObjectType):
    thumbnail = graphene.String()

    class Meta:
        model = ArchiveDocument

    @staticmethod
    def resolve_thumbnail(root: ArchiveDocument, info):
        return f"{get_thumbnail(root.file_location)}"
