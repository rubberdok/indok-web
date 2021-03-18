import graphene
from api.graphql.users.types import UserType
from apps.surveys.models import Answer, Option, Question, Response
from apps.surveys.models import Survey
from django.contrib.auth import get_user_model
from django.db.models.query_utils import Q
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required


class OptionType(DjangoObjectType):
    class Meta:
        model = Option
        fields = ["answer", "question", "id"]


class AnswerType(DjangoObjectType):
    user = graphene.Field(UserType)
    id = graphene.ID(source="uuid")

    class Meta:
        model = Answer
        fields = [
            "answer",
            "question",
            "uuid"
        ]
    
    @staticmethod
    @login_required
    def resolve_user(answer, info):
        return answer.response.respondent

class ResponseType(DjangoObjectType):
    answers = graphene.List(AnswerType)
    id = graphene.ID(source="uuid")


    class Meta:
        model = Response
        field = [
            "uuid",
            "respondent",
            "survey",
            "status"
        ]

    @staticmethod
    def resolve_answers(response, info):
        return response.answers


class QuestionType(DjangoObjectType):
    options = graphene.List(OptionType)
    answers = graphene.List(AnswerType, user_id=graphene.ID())
    answer = graphene.Field(AnswerType, user_id=graphene.ID(required=True))
    question_type = graphene.String()

    class Meta:
        model = Question
        fields = [
            "question",
            "description",
            "id",
            "position",
            "mandatory",
        ]

    @staticmethod
    def resolve_options(root: Question, info):
        return root.options.all()

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
    responses = graphene.List(ResponseType)

    class Meta:
        model = Survey
        fields = [
            "id",
            "descriptive_name",
            "description",
            "organization",
        ]

    @staticmethod
    def resolve_questions(root: Survey, info):
        return root.questions.all()

    @staticmethod
    @login_required
    def resolve_responders(root: Survey, info, user_id: int=None):
        q = Q(responses__survey=root)
        if user_id:
            q &= Q(pk=user_id)
        return get_user_model().objects.filter(q).distinct()
    
    @staticmethod
    @login_required
    def resolve_responder(root: Survey, info, user_id: int):
        return SurveyType.resolve_responders(root, info, user_id).first()

    @staticmethod
    @login_required
    def resolve_responses(survey, info):
        # TODO: Permissions
        return survey.responses

    



