from .models import JanuscriptDocument


class JanuscriptDocumentResolvers:
    # @permission_required("januscript.view_januscriptdocument")
    def resolve_all_januscript(self, info):
        documents = JanuscriptDocument.objects.all()
        return documents.reverse()
