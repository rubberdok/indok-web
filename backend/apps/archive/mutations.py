import graphene
from django.shortcuts import get_object_or_404
from decorators import permission_required

from .models import ArchiveDocument as ArchiveDocumentModel
from .types import ArchiveDocumentType


class CreateArchiveDocument(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        date = graphene.DateTime()
        type_doc = graphene.String()
        file_location = graphene.String()
        web_link = graphene.String()

    ok = graphene.Boolean()
    archiveDocument = graphene.Field(ArchiveDocumentType)

    @permission_required("archive.add_archivedocument")
    def mutate(self, info, title, date, type_doc, file_location):
        archiveDocument = ArchiveDocumentModel.objects.create(
            title=title,
            year=date.year if date else None,
            type_doc=type_doc,
            file_location=file_location,
        )
        ok = True
        return CreateArchiveDocument(archiveDocument=archiveDocument, ok=ok)


class UpdateArchiveDocument(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        id = graphene.ID()
        date = graphene.DateTime()
        type_doc = graphene.String()
        file_location = graphene.String()
        web_link = graphene.String()

    ok = graphene.Boolean()
    archiveDocument = graphene.Field(ArchiveDocumentType)

    @permission_required("archive.change_archivedocument")
    def mutate(self, info, id, title=None, date=None, type_doc=None, file_location=None, web_link=None):
        archiveDocument = ArchiveDocumentModel.objects.get(pk=id)
        if title is not None:
            archiveDocument.title = title
        if date is not None:
            archiveDocument.year = date.year
        if type_doc is not None:
            archiveDocument.type_doc = type_doc
        if file_location is not None:
            archiveDocument.file_location = file_location
        if web_link is not None:
            archiveDocument.web_link = web_link
        archiveDocument.save()

        ok = True
        return UpdateArchiveDocument(archiveDocument=archiveDocument, ok=ok)


class DeleteArchiveDocument(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    archiveDocument = graphene.Field(ArchiveDocumentType)

    @permission_required("archive.delete_archivedocument")
    def mutate(self, info, id):
        archiveDocument = get_object_or_404(ArchiveDocumentModel, pk=id)
        archiveDocument.delete()
        ok = True
        return DeleteArchiveDocument(archiveDocument=archiveDocument, ok=ok)
