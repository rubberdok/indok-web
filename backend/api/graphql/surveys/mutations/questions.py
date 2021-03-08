import graphene
from apps.surveys.models import Answer, Question
from apps.surveys.models import QuestionType as QuestionTypeModel
from apps.surveys.models import Survey
from django.db.models import Q
from graphql_jwt.decorators import login_required

from ..types import AnswerType, QuestionType, QuestionTypeType


class QuestionInput(graphene.InputObjectType):
    survey_id = graphene.ID()
    question_type_id = graphene.ID()
    question = graphene.String(required=False)
    description = graphene.String(required=False)
    position = graphene.Int()

class CreateQuestion(graphene.Mutation):
    ok = graphene.Boolean()
    question = graphene.Field(QuestionType)

    class Arguments:
        question_data = QuestionInput(required=True)

    @classmethod
    def mutate(cls, self, info, question_data):
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
    def mutate(cls, self, info, id, question_data):
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
    def mutate(cls, self, info, id):
        question = Question.objects.get(pk=id)
        deleted_id = question.id
        question.delete()
        ok = True
        return cls(ok=ok, deleted_id=deleted_id)

class QuestionTypeInput(graphene.InputObjectType):
    name = graphene.String(required=False)

class CreateQuestionType(graphene.Mutation):
    question_type = graphene.Field(QuestionTypeType)
    ok = graphene.Boolean()

    class Arguments:
        question_type_data = QuestionTypeInput(required=True)

    @classmethod
    def mutate(cls, self, info, question_type_data):
        question_type = QuestionTypeModel()
        for key, value in question_type_data.items():
            setattr(question_type, key, value)
        question_type.save()
        ok = True
        return cls(question_type=question_type, ok=ok)

class UpdateQuestionType(graphene.Mutation):
    question_type = graphene.Field(QuestionTypeType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        question_type_data = QuestionTypeInput(required=False)

    @classmethod
    def mutate(cls, self, info, id, question_type_data):
        question_type = QuestionTypeModel.objects.get(id=id)
        for key, value in question_type_data.items():
            setattr(question_type, key, value)
        question_type.save()
        ok = True
        return cls(question_type=question_type, ok=ok)

class DeleteQuestionType(graphene.Mutation):
    deleted_id = graphene.ID()
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    @classmethod
    def mutate(cls, self, info, id):
        question_type = QuestionTypeModel.objects.get(pk=id)
        deleted_id = question_type.id
        question_type.delete()
        ok = True
        return cls(deleted_id=deleted_id, ok=ok)

class AnswerInput(graphene.InputObjectType):
    question_id = graphene.ID()
    answer = graphene.String(required=True)

class CreateAnswer(graphene.Mutation):
    ok = graphene.Boolean()
    answer = graphene.Field(AnswerType)

    class Arguments:
        answer_data = AnswerInput(required=True)

    @classmethod
    @login_required
    def mutate(cls, self, info, answer_data):
        answer = Answer()
        for k, v in answer_data.items():
            setattr(answer, k, v)
        answer.user = info.context.user
        answer.save()
        ok = True
        return cls(answer=answer, ok=ok)

class UpdateAnswer(graphene.Mutation):
    ok = graphene.Boolean()
    answer = graphene.Field(AnswerType)

    class Arguments:
        id = graphene.ID(required=True)
        answer_data = AnswerInput(required=False)

    @classmethod
    @login_required
    def mutate(cls, self, info, id, answer_data):
        user = info.context.user
        try:
          answer = user.answers.get(pk=id)
        except Answer.DoesNotExist as e:
          return CreateAnswer(answer=None, ok=False)
        for k, v, in answer_data.items():
            setattr(answer, k, v)
        answer.save()
        ok = True
        return cls(answer=answer, ok=ok)

class DeleteAnswer(graphene.Mutation):
    ok = graphene.Boolean()
    deleted_id = graphene.ID()

    class Arguments:
        id = graphene.ID(required=True)

    @classmethod
    @login_required
    def mutate(cls, self, info, id):
        user = info.context.user
        try:
          answer = user.answers.get(pk=id)
        except Answer.DoesNotExist as e:
          return DeleteAnswer(deleted_id=None, ok=False)
        deleted_id = answer.id
        if answer.question.mandatory:
            return DeleteAnswer(deleted_id=None, ok=False)
        answer.delete()
        ok = True
        return cls(ok=ok, deleted_id=deleted_id)

class SubmitOrUpdateAnswers(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        answers_data = graphene.List(AnswerInput)

    @login_required
    def mutate(self, info, answers_data):
        user = info.context.user
        answers = {int(answer_data["question_id"]): answer_data["answer"] for answer_data in answers_data}
        questions = Question.objects.filter(pk__in=answers)

        survey = None
        for question in questions:
            if not survey:
                survey = question.survey
            else:
                if survey != question.survey:
                    raise ValueError(f"Expected questions to answer the survey f{survey}, but got f{question.survey}.")
        
        if survey:
            mandatory_questions = set(survey.questions.filter(mandatory=True).values_list("id", flat=True))
    
            # Update existing answers
            existing_answers = user.answers.filter(question__survey=survey)
            for answer in existing_answers:
                qid = answer.question.id
                if qid in answers:
                    new_answer = answers[qid]
                    answer.answer = new_answer
                    del answers[qid]

            Answer.objects.bulk_update(existing_answers, ["answer"])
        
            new_answers = set(answers)
            updated_answers = set(existing_answers.values_list("question__id", flat=True))

            if not mandatory_questions.issubset(temp := updated_answers.union(new_answers)):
                raise AssertionError(f"Not all mandatory questions have been answered, expected {mandatory_questions}, got {temp}")

            Answer.objects.bulk_create([
                Answer(user=user, question_id=question_id, answer=answer) for question_id, answer in answers.items()
            ])
            return SubmitOrUpdateAnswers(ok=True)
        return SubmitOrUpdateAnswers(ok=False)




class DeleteAnswersToSurvey(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        survey_id = graphene.ID()
    
    @login_required
    def mutate(self, info, survey_id):
        user = info.context.user
        user.answers.filter(survey_id=survey_id).delete()

        return DeleteAnswersToSurvey(ok = True)


        
