from decorators import permission_required

from .models import JanuscriptDocument


class ArchiDocumentResolvers:
    @permission_required("januscript.view_januscriptdocument")
    def resolve_featured_januscript(self, info):
        return JanuscriptDocument.objects.filter(featured=True)

    @permission_required("januscript.view_januscriptdocument")
    def resolve_januscript_by_types(self, info, type_doc, year=None, names=None):
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

    @permission_required("januscript.view_januscriptdocument")
    def resolve_available_years(self, info):
        return (
            JanuscriptDocument.objects.distinct("year")
            .exclude(year=None)
            .values_list("year", flat=True)
            .order_by("-year")
        )
