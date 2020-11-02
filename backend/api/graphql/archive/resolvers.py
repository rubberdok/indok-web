from apps.archive.models import ArchiveDocument
from django.db.models import Q
import graphene
from django.db.models.sql import Query


class ArchiveDocumentResolvers:
    def resolve_all_archives(parent, info):
        return ArchiveDocument.objects.all()

    def resolve_archive(parent, info, id):
        try:
            return ArchiveDocument.objects.get(id=id)
        except ArchiveDocument.DoesNotExist:
            return None

    def resolve_archive_by_date(parent, info, date):
        try:
            return ArchiveDocument.objects.get(date=date)
        except ArchiveDocument.DoesNotExist:
            return None

    def resolve_archive_by_type(parent, info, type_doc):
        try:
            return ArchiveDocument.objects.filter(type_doc=type_doc)
        except ArchiveDocument.DoesNotExist:
            return None