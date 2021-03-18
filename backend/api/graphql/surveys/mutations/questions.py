import graphene
from apps.surveys.models import Answer, Question, Option, Response
from apps.surveys.models import Survey
from django.db.models import Q
from graphql_jwt.decorators import login_required

from ..types import AnswerType, OptionType, QuestionType


class QuestionInput(graphene.InputObjectType):
    survey_id = graphene.ID()
    question_type = graphene.String()
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

class AnswerInput(graphene.InputObjectType):
    question_id = graphene.ID(required=True)
    answer = graphene.String(required=True)

class DeleteAnswer(graphene.Mutation):
    ok = graphene.Boolean()
    deleted_uuid = graphene.ID()

    class Arguments:
        uuid = graphene.ID(required=True)

    @login_required
    def mutate(self, info, uuid):
        user = info.context.user
        try:
          answer = user.answers.get(pk=uuid)
        except Answer.DoesNotExist as e:
          return DeleteAnswer(deleted_uuid=None, ok=False)
        deleted_uuid = answer.pk
        if answer.question.mandatory:
            return DeleteAnswer(deleted_uuid=None, ok=False)
        answer.delete()
        ok = True
        return DeleteAnswer(ok=ok, deleted_uuid=deleted_uuid)

class SubmitOrUpdateAnswers(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        survey_id = graphene.ID(required=True)
        answers_data = graphene.List(AnswerInput)

    @login_required
    def mutate(self, info, survey_id, answers_data):
        user = info.context.user
        try:
            survey = Survey.objects.get(pk=survey_id)
        except Survey.DoesNotExist:
            raise KeyError(f"The survey with id {survey_id} does not exist.")

        response, _ = Response.objects.get_or_create(survey_id=survey_id, responder=user)

        answers = {int(answer_data["question_id"]): answer_data["answer"] for answer_data in answers_data}

        if survey:
            mandatory_questions = survey.mandatory_questions
    
            # Update existing answers
            existing_answers = set(response.answers)
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
                Answer(response=response, question_id=question_id, answer=answer) for question_id, answer in answers.items()
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
        Response.objects.get(survey_id=survey_id, responder=user).delete()
        return DeleteAnswersToSurvey(ok = True)


class OptionInput(graphene.InputObjectType):
    answer = graphene.String(required=True)
    id = graphene.ID()

class CreateUpdateAndDeleteOptions(graphene.Mutation):
    ok = graphene.Boolean()
    options = graphene.List(OptionType)

    class Arguments:
        question_id = graphene.ID(required=True)
        option_data = graphene.List(OptionInput)

    def mutate(self, info, question_id, option_data):
        existing_options = Option.objects.filter(question__pk=question_id)
        submitted_ids = [option.get("id", -1) for option in option_data]

        existing_options.filter(~Q(pk__in=submitted_ids)).delete()
        existing_options = existing_options.filter(Q(pk__in=submitted_ids))

        new_options = []
        updated_options = []
        for data in option_data:
            if "id" in data:
                updated_option = existing_options.get(pk=data["id"])
                updated_option.answer = data["answer"]
                updated_options.append(updated_option)
            else:
                new_options.append(Option(answer=data["answer"], question_id=question_id))

        Option.objects.bulk_update(updated_options, fields=["answer"])
        Option.objects.bulk_create(new_options)

        return CreateUpdateAndDeleteOptions(options=[updated_option for updated_option in updated_options] + new_options, ok=True)



        
        



