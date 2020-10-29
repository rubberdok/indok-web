from apps.surveys.models import (
    Survey,
    QuestionType as QuestionTypeModel,
    Answer,
    OfferedAnswer,
    Question,
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
        model = QuestionTypeModel

class QuestionType(DjangoObjectType):
    offered_answers = graphene.List(OfferedAnswerType)

    class Meta:
        model = Question
        fields = [
            "question",
            "description",
            "id",
            "question_type",
            "position",
        ]

    @staticmethod
    def resolve_offered_answers(root: Question, info):
        return root.offered_answers.all()

    @staticmethod
    def resolve_answers(root: Question, info):
        return root.answers.all()

class SurveyType(DjangoObjectType):
    questions = graphene.List(QuestionType)

    class Meta:
        model = Survey
        fields = [
            "id",
            "descriptive_name",
            "description",
        ]

    @staticmethod
    def resolve_questions(root: Survey, info):
        return root.question_set.all()





