from apps.archive.models import ArchiveDocument
from django.db.models import Q
from django.db.models.sql import Query
from graphql_jwt.decorators import login_required


class ArchiveDocumentResolvers:
    @login_required
    def resolve_featured_archive(self, info, featured_names):
        featured = []
        if featured_names:
            for title in featured_names:
                featured.append(ArchiveDocument.objects.get(title__icontains=title))
        return featured

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
    def resolve_archive_by_names(self, info, names):
        if names:
            filteredDocs = ArchiveDocument.objects
            for element in names:
                filteredDocs = filteredDocs.filter(title__icontains=element)
            return filteredDocs
        return ArchiveDocument.objects.all()
