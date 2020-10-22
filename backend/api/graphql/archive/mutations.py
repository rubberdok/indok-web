from datetime import datetime

import graphene
from apps.archive.models import ArchiveDocument as ArchiveDocumentModel
from django.shortcuts import get_object_or_404
from graphene_django import DjangoObjectType

from .types import ArchiveDocumentType

class CreateArchiveDocument(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        description = graphene.String()
        date = graphene.DateTime()
        type_doc = graphene.String()
        file_location = graphene.String()

    ok = graphene.Boolean()
    arhiveDocument = graphene.Field(ArchiveDocumentType)

    def mutate(root, info, title, description, date, type_doc, file_location):
        archiveDocument = ArchiveDocumentModel.objects.create(
            title=title,
            description=description,
            date=date,
            uploaded_date = datetime.now(),
            type_doc = type_doc,
            file_location=file_location
        )
        ok = True
        return CreateArchiveDocument(archiveDocument=archiveDocument, ok=ok)


class UpdateArchiveDocument(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        id = graphene.ID()
        description = graphene.String()
        date = graphene.DateTime()
        type_doc = graphene.String()
        file_location = graphene.String()

    ok = graphene.Boolean()
    event = graphene.Field(ArchiveDocumentType)

    def mutate(root, info, id, title=None, description=None):
        archiveDocument = ArchiveDocumentModel.objects.get(pk=id)
        archiveDocument.title = title if title is not None else archiveDocument.title
        archiveDocument.description = (
            description if description is not None else event.description
        )

        ok = True
        return UpdateArchiveDocument(archiveDocument=archiveDocument, ok=ok)


class DeleteArchiveDocument(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    archiveDocument = graphene.Field(ArchiveDocumentType)

    def mutate(root, info, id):
        archiveDocument = get_object_or_404(ArchiveDocumentModel, pk=id)
        archiveDocument.delete()
        ok = True
        return DeleteArchiveDocument(archiveDocument=archiveDocument, ok=ok)
