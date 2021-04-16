import graphene
from graphene_django import DjangoObjectType

from .google_drive_api import get_thumbnail
from .models import ArchiveDocument


class ArchiveDocumentType(DjangoObjectType):
    thumbnail = graphene.String()

    class Meta:
        model = ArchiveDocument

    @staticmethod
    def resolve_thumbnail(root: ArchiveDocument, info):
        return get_thumbnail(root.file_location)
