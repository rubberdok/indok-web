from apps.archive.models import ArchiveDocument
from django.db.models import Q
from django.db.models.sql import Query
from graphql_jwt.decorators import login_required


class ArchiveDocumentResolvers:
    @login_required
    def resolve_all_archives(self, info):
        return ArchiveDocument.objects.all()

    @login_required
    def resolve_archive(self, info, id):
        try:
            return ArchiveDocument.objects.get(id=id)
        except ArchiveDocument.DoesNotExist:
            return None

    @login_required
    def resolve_archive_by_date(self, info, date):
        try:
            return ArchiveDocument.objects.get(date=date)
        except ArchiveDocument.DoesNotExist:
            return None

    @login_required
    def resolve_archive_by_types(self, info, type_doc, year=None):
        nonFilter = ["Foreningens lover", "Utveksling", "Annet", "Støtte fra HS"]
        documents = ArchiveDocument.objects.all()
        filter_docs_year = []
        if type_doc:
            documents = documents.filter(type_doc__in=type_doc)
        if year is not None:
            for doc in documents:
                if doc.type_doc not in nonFilter and doc.year != year:
                    filter_docs_year.append(doc.id)
        if filter_docs_year:
            documents = documents.exclude(id__in=filter_docs_year)
        return documents