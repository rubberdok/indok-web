from apps.surveys.models import (
    Survey,
    QuestionType as QuestionType,
    Answer,
    OfferedAnswer,
    SurveyQuestion,
)

from graphene_django import DjangoObjectType
import graphene

class OfferedAnswerType(DjangoObjectType):
    class Meta:
        model = OfferedAnswer


class AnswerType(DjangoObjectType):
    class Meta:
        model = Answer

class QuestionTypeType(DjangoObjectType):
    class Meta:
        model = QuestionType

class SurveyQuestionType(DjangoObjectType):
    offered_answers = graphene.List(OfferedAnswerType)

    class Meta:
        model = SurveyQuestion
        fields = [
            "question",
            "description",
            "id",
            "question_type",
            "position",
        ]

    @staticmethod
    def resolve_offered_answers(root: SurveyQuestion, info):
        return root.offered_answers.all()

    @staticmethod
    def resolve_answers(root: SurveyQuestion, info):
        return root.answers.all()

class SurveyType(DjangoObjectType):
    survey_questions = graphene.List(SurveyQuestionType)

    class Meta:
        model = Survey
        fields = [
            "id",
            "descriptive_name",
            "description",
        ]

    @staticmethod
    def resolve_survey_questions(root: Survey, info):
        return root.surveyquestion_set.all()





