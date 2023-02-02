from datetime import datetime

import graphene
from django.shortcuts import get_object_or_404
from decorators import login_required

from .models import JanuscriptDocument as JanuscriptDocumentModel
from .types import JanuscriptDocumentType


class CreateJanuscriptDocument(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        date = graphene.DateTime()
        type_doc = graphene.String()
        file_location = graphene.String()
        web_link = graphene.String()

    ok = graphene.Boolean()
    januscriptDocument = graphene.Field(JanuscriptDocumentType)

    @login_required
    def mutate(self, info, title, date, type_doc, file_location):
        januscriptDocument = JanuscriptDocumentModel.objects.create(
            title=title,
            date=date,
            uploaded_date=datetime.now(),
            type_doc=type_doc,
            file_location=file_location,
        )
        ok = True
        return CreateJanuscriptDocument(januscriptDocument=januscriptDocument, ok=ok)


class UpdateJanuscriptDocument(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        id = graphene.ID()
        date = graphene.DateTime()
        type_doc = graphene.String()
        file_location = graphene.String()
        web_link = graphene.String()

    ok = graphene.Boolean()
    event = graphene.Field(JanuscriptDocumentType)

    @login_required
    def mutate(self, info, id, title=None):
        januscriptDocument = JanuscriptDocumentModel.objects.get(pk=id)
        januscriptDocument.title = title if title is not None else januscriptDocument.title

        ok = True
        return UpdateJanuscriptDocument(januscriptDocument=januscriptDocument, ok=ok)


class DeleteJanuscriptDocument(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    januscriptDocument = graphene.Field(JanuscriptDocumentType)

    @login_required
    def mutate(self, info, id):
        januscriptDocument = get_object_or_404(JanuscriptDocumentModel, pk=id)
        januscriptDocument.delete()
        ok = True
        return DeleteJanuscriptDocument(januscriptDocument=januscriptDocument, ok=ok)
