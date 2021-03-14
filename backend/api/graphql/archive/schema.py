import graphene

from .mutations import (
    CreateArchiveDocument,
    DeleteArchiveDocument,
    UpdateArchiveDocument,
)
from .resolvers import ArchiveDocumentResolvers
from .types import ArchiveDocumentType


class ArchiveMutations(graphene.ObjectType):
    create_archiveDocument = CreateArchiveDocument.Field()
    update_archiveDocument = UpdateArchiveDocument.Field()
    delete_archiveDocument = DeleteArchiveDocument.Field()


class ArchiveQueries(graphene.ObjectType, ArchiveDocumentResolvers):
    featured_archive = graphene.List(
        ArchiveDocumentType,
    )
    archive_by_types = graphene.List(
        ArchiveDocumentType,
        type_doc=graphene.List(graphene.String, required=True),
        year=graphene.Int(required=False),
        names=graphene.String(required=False),
    )
    available_years = graphene.List(graphene.String)
