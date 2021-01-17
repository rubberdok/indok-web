from apps.archive.models import ArchiveDocument
from django.db.models import Q
from django.db.models.sql import Query
from graphql_jwt.decorators import login_required


class ArchiveDocumentResolvers:
    @login_required
    def resolve_all_archives(parent, info):
        return ArchiveDocument.objects.all()

    @login_required
    def resolve_archive(parent, info, id):
        try:
            return ArchiveDocument.objects.get(id=id)
        except ArchiveDocument.DoesNotExist:
            return None

    @login_required
    def resolve_archive_by_date(parent, info, date):
        try:
            return ArchiveDocument.objects.get(date=date)
        except ArchiveDocument.DoesNotExist:
            return None

    @login_required
    def resolve_archive_by_type(parent, info, type_docs):
        if type_docs:
            try:
                return ArchiveDocument.objects.filter(type_doc__in=type_docs)

            except ArchiveDocument.DoesNotExist:
                return None
        else:
            try:
                return ArchiveDocument.objects.all()

            except ArchiveDocument.DoesNotExist:
                return None
