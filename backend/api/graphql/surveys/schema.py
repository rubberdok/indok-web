from .types import (
    OfferedAnswerType,
    AnswerType,
    QuestionType,
    QuestionTypeType,
    SurveyType,
    SurveyQuestionType,
)
from .resolvers import (
    OfferedAnswerResolvers,
    QuestionTypeResolvers,
    QuestionResolvers,
    SurveyResolvers,
    SurveyQuestionResolvers,
    AnswerResolvers,
)

from .mutations import (
    CreateQuestion,
    UpdateQuestion,
    DeleteQuestion,
)
import graphene


class SurveyQueries(
    graphene.ObjectType,
    OfferedAnswerResolvers,
    QuestionTypeResolvers,
    QuestionResolvers,
    SurveyResolvers,
    SurveyQuestionResolvers,
    AnswerResolvers
):
    offered_answer = graphene.Field(OfferedAnswerType, id=graphene.ID())
    offered_answers = graphene.List(OfferedAnswerType, search=graphene.String())

    question_type = graphene.Field(QuestionTypeType, id=graphene.ID())
    question_types = graphene.List(QuestionTypeType, search=graphene.String())

    question = graphene.Field(QuestionType, id=graphene.ID())
    questions = graphene.List(QuestionType, search=graphene.String())

    survey = graphene.Field(SurveyType, id=graphene.ID())
    surveys = graphene.List(SurveyType, search=graphene.String())

    survey_question = graphene.Field(SurveyQuestionType, id=graphene.ID())
    survey_questions = graphene.List(SurveyQuestionType, search=graphene.String())

    answer = graphene.Field(AnswerType, id=graphene.ID())
    answers = graphene.List(AnswerType, search=graphene.String())

class SurveyMutations(graphene.ObjectType):
    create_question = CreateQuestion.Field()
    update_question = UpdateQuestion.Field()
    delete_question = DeleteQuestion.Field()