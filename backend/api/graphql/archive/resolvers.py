from apps.archive.models import ArchiveDocument

class ArchiveDocumentResolvers:
    def resolve_all_archives(parent, info):
        return ArchiveDocument.objects.all()

    def resolve_archive(parent, info, id):
        try:
            return ArchiveDocument.objects.get(id=id)
        except ArchiveDocument.DoesNotExist:
            return None