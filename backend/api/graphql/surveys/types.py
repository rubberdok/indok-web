import graphene
from api.graphql.users.types import UserType
from apps.surveys.models import Answer, OfferedAnswer, Question
from apps.surveys.models import QuestionType as QuestionTypeModel
from apps.surveys.models import Survey
from django.contrib.auth import get_user_model
from django.db.models.query_utils import Q
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required


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
            "mandatory",
        ]

    @staticmethod
    def resolve_offered_answers(root: Question, info):
        return root.offered_answers.all()

    @staticmethod
    @login_required
    def resolve_answers(root: Question, info, user_id: int=None):
        qs = root.answers
        if user_id:
            return qs.filter(user__pk=user_id).distinct()
        return qs.all()
    
    @staticmethod
    @login_required
    def resolve_answer(root: Question, info, user_id: int):
        return root.answers.filter(user__pk=user_id).first()

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
    def resolve_responders(root: Survey, info, user_id: int=None):
        """ 
        Parameters
        ----------
        root : Survey
            The survey instance
        info 
            
        user_id : int, optional
            By default None

        Returns
        -------
        A queryset of all users who have submitted answers to questions in a given survey
        """
        q = Q(answers__question__survey=root)
        if user_id:
            q &= Q(pk=user_id)
        return get_user_model().objects.filter(q).distinct()
    
    @staticmethod
    @login_required
    def resolve_responder(root: Survey, info, user_id: int):
        return SurveyType.resolve_responders(root, info, user_id).first()

    



