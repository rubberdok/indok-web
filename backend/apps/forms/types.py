import graphene
from django.contrib.auth import get_user_model
from django.db.models.query_utils import Q
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from ..users.types import UserType
from .models import Answer, Form, Option, Question, Response


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
        fields = ["answer", "question", "uuid"]
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
        field = ["uuid", "respondent", "form", "status"]
        description = "A response instance that contains information about a user's response to a form."

    @staticmethod
    @login_required
    def resolve_answers(response, info):
        if response.respondent == info.context.user or info.context.user.is_superuser:
            return response.answers.all()
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
        description = "A question on a form."

    @staticmethod
    def resolve_options(root: Question, info):
        return root.options.all()

    @staticmethod
    @login_required
    def resolve_answers(root: Question, info, user_id: int = None):
        answers = root.answers
        if user_id:
            return answers.filter(response__respondent__pk=user_id)
        return answers.all()

    @staticmethod
    @login_required
    def resolve_answer(root: Question, info, user_id: int):
        return root.answers.get(response__respondent__pk=user_id)


class FormType(DjangoObjectType):
    questions = graphene.List(QuestionType)
    responders = graphene.List(UserType, user_id=graphene.ID(), required=True)
    responder = graphene.Field(UserType, user_id=graphene.ID(required=True))
    responses = graphene.List(ResponseType, required=True)

    class Meta:
        model = Form
        fields = [
            "id",
            "name",
            "description",
            "organization",
        ]
        description = "A form containing questions, optionally linked to a listing."

    @staticmethod
    def resolve_questions(root: Form, info):
        return root.questions.all()

    @staticmethod
    @login_required
    def resolve_responders(root: Form, info, user_id: int = None):
        # TODO: Row level permissions
        if info.context.user.is_superuser:
            q = Q(responses__form=root)
            if user_id:
                q &= Q(pk=user_id)
            return get_user_model().objects.filter(q).distinct()
        else:
            raise NotImplementedError("Dette kallet er ikke implementert enda")

    @staticmethod
    @login_required
    def resolve_responder(root: Form, info, user_id: int):
        # TODO: Row level permissions
        if info.context.user.is_superuser:
            return get_user_model().objects.get(responses__form=root, pk=user_id)
        else:
            raise NotImplementedError("Dette kallet er ikke implementert end")

    @staticmethod
    @login_required
    def resolve_responses(root: Form, info):
        # TODO: Row level permissions
        if info.context.user.is_superuser:
            return root.responses.all()
        else:
            raise NotImplementedError("Dette kallet er ikke implementert enda")
