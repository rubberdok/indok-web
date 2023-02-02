import graphene
from graphene_django import DjangoObjectType

from .google_drive_api import GoogleDriveAPI
from .models import ArchiveDocument


class ArchiveDocumentType(DjangoObjectType):
    thumbnail = graphene.String()

    class Meta:
        model = ArchiveDocument

    @staticmethod
    def resolve_thumbnail(root: ArchiveDocument, info):
        drive = GoogleDriveAPI()
        return drive.get_thumbnail(root.file_location)
