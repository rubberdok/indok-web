from django.contrib.auth import get_user_model, login
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
    answers = graphene.List(AnswerType, user_id=graphene.ID())
    answer = graphene.Field(AnswerType, user_id=graphene.ID(required=True))

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
    @login_required
    def resolve_answers(root: Question, info, user_id: int=None):
        if id:
            return root.answers.filter(user__pk=user_id).first()
        return root.answers.all()
    
    @staticmethod
    @login_required
    def resolve_answer(root: Question, info, user_id: int):
        return QuestionType.resolve_answers(root, info, user_id)

class SurveyType(DjangoObjectType):
    questions = graphene.List(QuestionType)
    responders = graphene.List(UserType, user_id=graphene.ID())
    responder = graphene.Field(UserType, user_id=graphene.ID(required=True))

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

    @staticmethod
    @login_required
    def resolve_responders(root: Survey, info, user_id=None):
        q = Q(answers__question__survey=root)
        if user_id:
            q &= Q(pk=user_id)
        return get_user_model().objects.filter(q).distinct()
    
    @staticmethod
    @login_required
    def resolve_responder(root: Survey, info, user_id: int):
        return SurveyType.resolve_responders(root, info, user_id).first()

    



