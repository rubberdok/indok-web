from datetime import datetime

import graphene
from apps.archive.models import ArchiveDocument as ArchiveDocumentModel
from django.shortcuts import get_object_or_404
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from .types import ArchiveDocumentType


class CreateArchiveDocument(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        date = graphene.DateTime()
        type_doc = graphene.String()
        file_location = graphene.String()
        web_link = graphene.String()

    ok = graphene.Boolean()
    arhiveDocument = graphene.Field(ArchiveDocumentType)

    @login_required
    def mutate(root, info, title, date, type_doc, file_location):
        archiveDocument = ArchiveDocumentModel.objects.create(
            title=title,
            date=date,
            uploaded_date=datetime.now(),
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
    event = graphene.Field(ArchiveDocumentType)

    @login_required
    def mutate(root, info, id, title=None):
        archiveDocument = ArchiveDocumentModel.objects.get(pk=id)
        archiveDocument.title = title if title is not None else archiveDocument.title

        ok = True
        return UpdateArchiveDocument(archiveDocument=archiveDocument, ok=ok)


class DeleteArchiveDocument(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    archiveDocument = graphene.Field(ArchiveDocumentType)

    @login_required
    def mutate(root, info, id):
        archiveDocument = get_object_or_404(ArchiveDocumentModel, pk=id)
        archiveDocument.delete()
        ok = True
        return DeleteArchiveDocument(archiveDocument=archiveDocument, ok=ok)
