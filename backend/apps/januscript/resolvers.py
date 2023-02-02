from decorators import permission_required

from .models import JanuscriptDocument


class ArchiveDocumentResolvers:
    @permission_required("archive.view_archivedocument")
    def resolve_featured_archive(self, info):
        return JanuscriptDocument.objects.filter(featured=True)

    @permission_required("archive.view_archivedocument")
    def resolve_archive_by_types(self, info, type_doc, year=None, names=None):
        documents = JanuscriptDocument.objects.all()
        if type_doc:
            documents = documents.filter(type_doc__in=type_doc)
        if year is not None:
            documents = documents.filter(year=year)
        if names is not None:
            name_list = names.split(" ")
            for element in name_list:
                documents = documents.filter(title__icontains=element)

        return documents.reverse()

    @permission_required("archive.view_archivedocument")
    def resolve_available_years(self, info):
        return (
            JanuscriptDocument.objects.distinct("year")
            .exclude(year=None)
            .values_list("year", flat=True)
            .order_by("-year")
        )
