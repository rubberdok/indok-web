from django.contrib.auth import get_user_model
from django.db.models.query_utils import Q
from apps.surveys.models import (
    Survey,
    QuestionType as QuestionTypeModel,
    Answer,
    OfferedAnswer,
    Question,
)

from api.graphql.users.types import UserType

from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
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
    answers = graphene.List(AnswerType)

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
    def resolve_answers(root: Question, info, user_id: str=None):
        if user_id:
            return root.answers.filter(user_id=user_id)
        return root.answers.all()

class SurveyType(DjangoObjectType):
    questions = graphene.List(QuestionType)
    responders = graphene.List(UserType)

    class Meta:
        model = Survey
        fields = [
            "id",
            "descriptive_name",
            "description",
        ]

    @staticmethod
    def resolve_questions(root: Survey, info):
        return root.questions.all()

    @login_required
    def resolve_responders(root: Survey, info):
        return get_user_model().objects.filter(answers__question__survey=root).distinct()




