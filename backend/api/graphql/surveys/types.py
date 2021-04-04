from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from api.graphql.users.types import UserType
from apps.surveys.models import Answer, Option, Question, Response, Survey
from utils.decorators import permission_required


class OptionType(DjangoObjectType):
    class Meta:
        model = Option
        fields = ["answer", "question", "id"]
        description = "Option for multiple choice questions"


class AnswerType(DjangoObjectType):
    id = graphene.UUID(source="uuid")

    class Meta:
        model = Answer
        fields = ["answer", "question", "uuid", "user"]
        description = "A user's answer to a question."


class QuestionType(DjangoObjectType):
    options = graphene.List(OptionType)
    answers = graphene.List(AnswerType, user_id=graphene.ID())
    question_type = graphene.String()

    class Meta:
        model = Question
        fields = [
            "question",
            "description",
            "id",
            "mandatory",
        ]
        description = "A question on a survey."

    @staticmethod
    @login_required
    def resolve_options(parent: Question, info):
        return parent.options.all()

    @staticmethod
    @login_required
    def resolve_answers(parent: Question, info):
        if info.context.user.has_perm("surveys.manage_survey", parent.survey):
            return parent.answers


class ResponseType(DjangoObjectType):
    id = graphene.UUID(source="uuid")
    questions = graphene.List(QuestionType)

    class Meta:
        model = Response
        field = ["uuid", "respondent", "survey", "status", "answers"]
        description = "A response instance that contains information about a user's response to a survey."

    @staticmethod
    def resolve_questions(parent: Response, info):
        return parent.survey.questions


class SurveyType(DjangoObjectType):
    responders = graphene.List(UserType, user_id=graphene.ID())
    responder = graphene.Field(UserType, user_id=graphene.ID(required=True))
    responses = graphene.List(ResponseType)
    response = graphene.Field(ResponseType, response_pk=graphene.UUID())

    class Meta:
        model = Survey
        fields = [
            "id",
            "name",
            "description",
            "organization",
            "questions"
        ]
        description = "A survey containing questions, optionally linked to a listing."

    @staticmethod
    @permission_required("surveys.manage_survey")
    def resolve_responders(parent: Survey, info):
        return get_user_model().objects.filter(responses__survey=root).distinct()

    @staticmethod
    @permission_required("surveys.manage_survey")
    def resolve_responder(parent: Survey, info, user_id: int):
        return get_user_model().objects.get(responses__survey=root, pk=user_id)

    @staticmethod
    @permission_required("surveys.manage_survey")
    def resolve_responses(parent, info):
        return parent.responses

    @staticmethod
    @permission_required("surveys.manage_survey")
    def resolve_response(parent, info, response_pk):
        return parent.responses.get(pk=response_pk)
