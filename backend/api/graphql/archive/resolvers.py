from apps.archive.models import ArchiveDocument
from django.db.models import Max, Min
from django.db.models.sql import Query
from graphql_jwt.decorators import login_required


class ArchiveDocumentResolvers:
    @login_required
    def resolve_featured_archive(self, info):
        return ArchiveDocument.objects.filter(featured=True)

    @login_required
    def resolve_archive_by_types(self, info, type_doc, year=None, names=None):
        documents = ArchiveDocument.objects.all()
        if type_doc:
            documents = documents.filter(type_doc__in=type_doc)
        if year is not None:
            documents = documents.filter(year=year)
        if names is not None:
            l = list(names.split(" "))
            for element in l:
                documents = documents.filter(title__icontains=element)

        return documents.reverse()

    @login_required
    def resolve_years_selector(self, info):
        min_year = ArchiveDocument.objects.aggregate(Min("year"))
        max_year = ArchiveDocument.objects.aggregate(Max("year"))
        return [min_year, max_year]
