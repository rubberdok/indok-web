from typing import Optional
from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from api.graphql.users.types import UserType
from apps.surveys.models import Answer, Option, Question, Response, Survey
from utils.decorators import permission_required


class QuestionTypeEnum(graphene.Enum):
    PARAGRAPH = "PARAGRAPH"
    SHORT_ANSWER = "SHORT_ANSWER"
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    CHECKBOXES = "CHECKBOXES"
    DROPDOWN = "DROPDOWN"
    SLIDER = "SLIDER"
    FILE_UPLOAD = "FILE_UPLOAD"


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
    question_type = graphene.Field(QuestionTypeEnum)
    answer = graphene.Field(AnswerType)

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
    def resolve_answers(parent: Question, info) -> Optional[list[Answer]]:
        # Can be changed to @permission_required_or_none("surveys.manage_survey", fn=get_resolver_parent) if #141 is merged
        if info.context.user.has_perm("surveys.manage_survey", parent.survey):
            return parent.answers

    @staticmethod
    @login_required
    def resolve_answer(parent: Question, info):
        try:
            return info.context.user.answers.get(question=parent)
        except Answer.DoesNotExist:
            return None


class ResponseType(DjangoObjectType):
    id = graphene.UUID(source="uuid")
    questions = graphene.List(QuestionType)

    class Meta:
        model = Response
        field = ["uuid", "respondent", "survey", "status", "answers"]
        description = "A response instance that contains information about a user's response to a survey."

    @staticmethod
    def resolve_questions(parent: Response, info):
        return parent.survey.questions.all()


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
    @login_required
    def resolve_responders(parent: Survey, info):
        # Can be changed to @permission_required_or_none("surveys.manage_survey", fn=get_resolver_parent) if #141 is merged
        if info.context.user.has_perm("surveys.manage_survey", parent):
            return get_user_model().objects.filter(responses__survey=parent).distinct()
        return None

    @staticmethod
    @login_required
    def resolve_responder(parent: Survey, info, user_id: int):
        # Can be changed to @permission_required_or_none("surveys.manage_survey", fn=get_resolver_parent) if #141 is merged
        if info.context.user.has_perm("surveys.manage_survey", parent):
            return get_user_model().objects.get(responses__survey=parent, pk=user_id)
        return None

    @staticmethod
    @login_required
    def resolve_responses(parent, info):
        # Can be changed to @permission_required_or_none("surveys.manage_survey", fn=get_resolver_parent) if #141 is merged
        if info.context.user.has_perm("surveys.manage_survey", parent):
            return parent.responses.all()
        return None

    @staticmethod
    @login_required
    def resolve_response(parent, info, response_pk):
        # Can be changed to @permission_required_or_none("surveys.manage_survey", fn=get_resolver_parent) if #141 is merged
        if info.context.user.has_perm("surveys.manage_survey", parent):
            return parent.responses.get(pk=response_pk)
        return None
