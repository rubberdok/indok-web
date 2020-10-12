from .types import (
    OfferedAnswerType,
    AnswerType,
    QuestionType,
    QuestionTypeType,
    SurveyType,
    SurveyQuestionType,
)
from .resolvers import OfferedAnswerResolvers, QuestionTypeResolvers
import graphene


class OfferedAnswerQueries(graphene.ObjectType, OfferedAnswerResolvers):
    offered_answer = graphene.Field(OfferedAnswerType, id=graphene.ID())
    offered_answers = graphene.List(OfferedAnswerType, search=graphene.String())

class QuestionTypeQueries(graphene.ObjectType, QuestionTypeResolvers):
    question_type = graphene.Field(QuestionType, id=graphene.ID())
    question_types = graphene.List(QuestionType, search=graphene.String())