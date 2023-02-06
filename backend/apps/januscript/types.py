import graphene
from graphene_django import DjangoObjectType

from .models import JanuscriptDocument


class JanuscriptDocumentType(DjangoObjectType):
    thumbnail = graphene.String()

    class Meta:
        model = JanuscriptDocument


"""     @staticmethod
    def resolve_thumbnail(root: JanuscriptDocument, info):
        drive = GoogleDriveAPI()
        return drive.get_thumbnail(root.file_location) """
