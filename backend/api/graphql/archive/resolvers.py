from apps.archive.models import ArchiveDocument

class ArchiveDocumentResolvers:
    def resolve_all_archives( parent, info):
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
            return ArchiveDocument.objects.get(type_doc=type_doc)
        except ArchiveDocument.DoesNotExist:
            return None





   