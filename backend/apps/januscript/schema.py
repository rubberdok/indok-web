import graphene
from graphene import NonNull

from .mutations import (
    CreateJanuscriptDocument,
    DeleteJanuscriptDocument,
    UpdateJanuscriptDocument,
)
from .resolvers import JanuscriptDocumentResolvers
from .types import JanuscriptDocumentType


class JanuscriptMutations(graphene.ObjectType):
    create_januscriptDocument = CreateJanuscriptDocument.Field()
    update_januscriptDocument = UpdateJanuscriptDocument.Field()
    delete_januscriptDocument = DeleteJanuscriptDocument.Field()


class JanuscriptQueries(graphene.ObjectType, JanuscriptDocumentResolvers):
    featured_januscript = graphene.List(NonNull(JanuscriptDocumentType), required=True)
    januscript_by_types = graphene.List(
        NonNull(JanuscriptDocumentType),
        type_doc=graphene.List(graphene.String, required=True),
        year=graphene.Int(required=False),
        names=graphene.String(required=False),
        required=True,
    )
    available_years = graphene.List(NonNull(graphene.String), required=True)
