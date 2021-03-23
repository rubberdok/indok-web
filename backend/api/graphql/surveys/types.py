from django.contrib.auth import get_user_model
from django.db.models.query_utils import Q

import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from api.graphql.users.types import UserType
from apps.surveys.models import Answer, Option, Question, Response, Survey


class OptionType(DjangoObjectType):
    class Meta:
        model = Option
        fields = ["answer", "question", "id"]
        description = "Option for multiple choice questions"


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
        description = "A user's answer to a question."
    
    @staticmethod
    @login_required
    def resolve_user(answer, info):
        raise NotImplementedError("Dette kallet er ikke implementert enda")
        # TODO: Add row level permissions
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
        description = "A response instance that contains information about a user's response to a survey."

    @staticmethod
    @login_required
    def resolve_answers(response, info):
        if response.respondent == info.context.user:
            return response.answers
        else:
            raise PermissionError("Du har ikke tilgang til dette.")


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
        description = "A survey containing questions, optionally linked to a listing."

    @staticmethod
    def resolve_questions(root: Survey, info):
        return root.questions.all()

    @staticmethod
    @login_required
    def resolve_responders(root: Survey, info, user_id: int=None):
        # TODO: Row level permissions
        if info.context.user.is_superuser:
            q = Q(responses__survey=root)
            if user_id:
                q &= Q(pk=user_id)
            return get_user_model().objects.filter(q).distinct()
        else:
            raise NotImplementedError("Dette kallet er ikke implementert enda")
    
    @staticmethod
    @login_required
    def resolve_responder(root: Survey, info, user_id: int):
        # TODO: Row level permissions
        if info.context.user.is_superuser:
            return get_user_model().objects.get(responses__survey=root, pk=user_id)
        else:
            raise NotImplementedError("Dette kallet er ikke implementert end")
