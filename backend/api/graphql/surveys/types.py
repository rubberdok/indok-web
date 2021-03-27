from django.contrib.auth import get_user_model
from django.db.models.query_utils import Q
from guardian.shortcuts import get_objects_for_user

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
    id = graphene.ID(source="uuid")

    class Meta:
        model = Answer
        fields = ["answer", "question", "uuid", "user"]
        description = "A user's answer to a question."


class ResponseType(DjangoObjectType):
    id = graphene.ID(source="uuid")

    class Meta:
        model = Response
        field = ["uuid", "respondent", "survey", "status", "answers"]
        description = "A response instance that contains information about a user's response to a survey."


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
            "mandatory",
        ]
        description = "A question on a survey."

    @staticmethod
    def resolve_options(root: Question, info):
        return root.options.all()

    @staticmethod
    @login_required
    def resolve_answers(root: Question, info):
        return get_objects_for_user(info.context.user, "surveys.view_answer").filter(question=root)

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
            "name",
            "description",
            "organization",
        ]
        description = "A survey containing questions, optionally linked to a listing."

    @staticmethod
    def resolve_questions(root: Survey, info):
        return root.questions.all()

    @staticmethod
    @login_required
    @permission_required("surveys.view_response", obj_arg_pos=0)
    def resolve_responders(root: Survey, info):
        return get_user_model().objects.filter(responses__survey=root).distinct()

    @staticmethod
    @login_required
    @permission_required("surveys.view_response", obj_arg_pos=0)
    def resolve_responder(root: Survey, info, user_id: int):
        return get_user_model().objects.get(responses__survey=root, pk=user_id)

    @staticmethod
    @login_required
    @permission_required("surveys.view_response", obj_arg_pos=0)
    def resolve_responses(survey, info):
        return survey.responses
