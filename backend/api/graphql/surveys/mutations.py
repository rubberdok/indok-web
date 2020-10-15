from apps.surveys.models import (
    Question,
    Survey,
    Answer,
    OfferedAnswer,
    QuestionType,
    SurveyQuestion,
)

from .types import (
    QuestionType,
    SurveyType,
    AnswerType,
    OfferedAnswerType,
    QuestionTypeType,
    SurveyQuestionType,
)
from typing import Optional
import graphene

class QuestionInput(graphene.InputObjectType):
    question = graphene.String(required=False)
    description = graphene.String(required=False)

class CreateQuestion(graphene.Mutation):
    ok = graphene.Boolean()
    question = graphene.Field(QuestionType)

    class Arguments:
        question_data: QuestionInput = QuestionInput(required=True)

    @classmethod
    def mutate(cls, info, question_data):
        question = Question()
        for k, v in question_data.items():
            setattr(question, k, v)
        question.save()
        ok = True
        return cls(question=question, ok=ok)

class UpdateQuestion(graphene.Mutation):
    ok = graphene.Boolean()
    question = graphene.Field(QuestionType)

    class Arguments:
        id = graphene.ID(required=True)
        question_data = QuestionInput(required=False)

    @classmethod
    def mutate(cls, info, id, question_data):
        question = Question.objects.get(pk=id)
        for k, v, in question_data.items():
            setattr(question, k, v)
        question.save()
        ok = True
        return cls(question=question, ok=ok)

class DeleteQuestion(graphene.Mutation):
    ok = graphene.Boolean()
    deleted_id = graphene.ID()

    class Arguments:
        id = graphene.ID(required=True)

    @classmethod
    def mutate(cls, info, id):
        question = Question.objecst.get(pk=id)
        deleted_id = question.id
        question.delete()
        ok = True
        return cls(ok=ok, deleted_id=deleted_id)