from apps.surveys.models import (
    Survey,
    Question,
    QuestionType as QuestionTypeModel,
    Answer,
    OfferedAnswer,
    SurveyQuestion,
)

from graphene_django import DjangoObjectType

class SurveyType(DjangoObjectType):
    class Meta:
        model = Survey

class QuestionType(DjangoObjectType):
    class Meta:
        model = Question

class QuestionTypeType(DjangoObjectType):
    class Meta:
        model = QuestionTypeModel

class AnswerType(DjangoObjectType):
    class Meta:
        model = Answer

class OfferedAnswerType(DjangoObjectType):
    class Meta:
        model = OfferedAnswer

class SurveyQuestionType(DjangoObjectType):
    class Meta:
        model = SurveyQuestion