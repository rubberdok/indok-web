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
    all_januscript = graphene.List(NonNull(JanuscriptDocumentType))
