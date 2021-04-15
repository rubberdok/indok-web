from graphql_jwt.decorators import login_required

from .models import ArchiveDocument


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
    def resolve_available_years(self, info):
        return (
            ArchiveDocument.objects.distinct("year")
            .exclude(year=None)
            .values_list("year", flat=True)
            .order_by("-year")
        )
