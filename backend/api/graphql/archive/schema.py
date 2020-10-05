import graphene

from .mutations import CreateArchiveDocument, DeleteArchiveDocument, UpdateArchiveDocument
from .resolvers import ArchiveDocumentResolvers
from .types import ArchiveDocumentType


class ArchiveMutations(graphene.ObjectType):
    create_archiveDocument = CreateArchiveDocument.Field()
    update_archiveDocument = UpdateArchiveDocument.Field()
    delete_archiveDocument = DeleteArchiveDocument.Field()


class ArchiveQueries(graphene.ObjectType, ArchiveDocumentResolvers):
    all_archives = graphene.List(ArchiveDocumentType)
    archiveDocument = graphene.Field(ArchiveDocumentType, id=graphene.ID(required=True))
