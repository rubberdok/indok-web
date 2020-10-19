import graphene
from graphene import ObjectType
from apps.archive.models import ArchiveDocument
from graphene_django import DjangoObjectType
from apps.archive.google_drive_api import get_url, get_thumbNail

class URLType(graphene.ObjectType):
    url = graphene.String()
    thumbnail = graphene.String()

class ArchiveDocumentType(DjangoObjectType):
    urls = graphene.Field(URLType)
    
    class Meta:
        model = ArchiveDocument

    @staticmethod
    def resolve_urls(root: ArchiveDocument, info):
        return {"url":f"{get_url(root.file_location)}", "thumbnail": f"{get_thumbNail(root.file_location)}"}
