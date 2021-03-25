from django.db.models import Q

import graphene
from graphql_jwt.decorators import login_required, permission_required

from apps.surveys.models import Answer, Option, Question, Response, Survey
from ..types import OptionType, QuestionType


class QuestionTypeEnum(graphene.Enum):
    PARAGRAPH = "PARAGRAPH"
    SHORT_ANSWER = "SHORT_ANSWER"
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    CHECKBOXES = "CHECKBOXES"
    DROPDOWN = "DROPDOWN"
    SLIDER = "SLIDER"
    FILE_UPLOAD = "FILE_UPLOAD"


class BaseQuestionInput(graphene.InputObjectType):
    survey_id = graphene.ID()
    question_type = graphene.Field(QuestionTypeEnum)
    question = graphene.String()
    description = graphene.String()


class CreateQuestionInput(BaseQuestionInput):
    survey_id = graphene.ID(required=True)
    question = graphene.String(required=True)


class CreateQuestion(graphene.Mutation):
    ok = graphene.Boolean()
    question = graphene.Field(QuestionType)

    class Arguments:
        question_data = CreateQuestionInput(required=True)

    @login_required
    @permission_required("surveys.add_question")
    def mutate(self, info, question_data):
        question = Question()
        for k, v in question_data.items():
            if v is not None:
                setattr(question, k, v)
        question.save()
        ok = True
        return CreateQuestion(question=question, ok=ok)


class UpdateQuestion(graphene.Mutation):
    ok = graphene.Boolean()
    question = graphene.Field(QuestionType)

    class Arguments:
        id = graphene.ID(required=True)
        question_data = BaseQuestionInput(required=True)

    @permission_required("surveys.update_question")
    def mutate(self, info, id, question_data):
        try:
            question = Question.objects.get(pk=id)
        except Question.DoesNotExist:
            return UpdateQuestion(question=None, ok=False)
        for (
            k,
            v,
        ) in question_data.items():
            setattr(question, k, v)
        question.save()
        return UpdateQuestion(question=question, ok=True)


class DeleteQuestion(graphene.Mutation):
    ok = graphene.Boolean()
    deleted_id = graphene.ID()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    @permission_required("surveys.delete_question")
    def mutate(self, info, id):
        try:
            question = Question.objects.get(pk=id)
        except Question.DoesNotExist:
            return DeleteQuestion(ok=False, deleted_id=None)
        deleted_id = question.id
        question.delete()
        ok = True
        return DeleteQuestion(ok=ok, deleted_id=deleted_id)


class AnswerInput(graphene.InputObjectType):
    question_id = graphene.ID(required=True)
    answer = graphene.String(required=True)


class DeleteAnswer(graphene.Mutation):
    ok = graphene.Boolean()
    deleted_uuid = graphene.ID()

    class Arguments:
        uuid = graphene.ID(required=True)

    @login_required
    @permission_required("surveys.delete_answer")
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
    @permission_required(["surveys.add_answer", "surveys.update_answers"])
    def mutate(self, info, survey_id, answers_data):
        """Creates new answers to previously unanswered questions, updates already existings answers.

        Parameters
        ----------
        info : GraphQLResolveInfo

        survey_id : int
            The ID of the survey to which the answers are submitted
        answers_data : list[AnswerInput]

        Raises
        ------
        KeyError
            If the survey is not found
        AssertionError
            If not all mandatory questions have been answered
        """
        user = info.context.user
        try:
            survey = Survey.objects.get(pk=survey_id)
        except Survey.DoesNotExist:
            raise KeyError(f"The survey with id {survey_id} does not exist.")

        response, _ = Response.objects.get_or_create(
            survey_id=survey_id, responder=user
        )

        answers = {
            int(answer_data["question_id"]): answer_data["answer"]
            for answer_data in answers_data
        }

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
            updated_answers = set(
                existing_answers.values_list("question__id", flat=True)
            )

            if not mandatory_questions.issubset(
                temp := updated_answers.union(new_answers)
            ):
                # Not all mandatory questions have been answered
                raise AssertionError(
                    f"Not all mandatory questions have been answered, expected {mandatory_questions}, got {temp}"
                )

            Answer.objects.bulk_create(
                [
                    Answer(response=response, question_id=question_id, answer=answer)
                    for question_id, answer in answers.items()
                ]
            )
            return SubmitOrUpdateAnswers(ok=True)
        return SubmitOrUpdateAnswers(ok=False)


class DeleteAnswersToSurvey(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        survey_id = graphene.ID()

    @login_required
    @permission_required("surveys.delete_answer")
    def mutate(self, info, survey_id):
        user = info.context.user
        Response.objects.get(survey_id=survey_id, responder=user).delete()
        return DeleteAnswersToSurvey(ok=True)


class OptionInput(graphene.InputObjectType):
    answer = graphene.String(required=True)
    id = graphene.ID()


class CreateUpdateAndDeleteOptions(graphene.Mutation):
    ok = graphene.Boolean()
    options = graphene.List(OptionType)

    class Arguments:
        question_id = graphene.ID(required=True)
        option_data = graphene.List(OptionInput)

    @login_required
    @permission_required(
        ["surveys.add_option", "surveys.update_option", "surveys.delete_option"]
    )
    def mutate(self, info, question_id, option_data):
        """Bulk operation to refresh the options to a given question. Has three main operations:
        (1): Creates new options for inputs without an option_id
        (2): Updates options for inputs with an option_id and data
        (3): Deletes existings options if their ID is not included in the option_data

        Parameters
        ----------
        info : GraphQLResolveInfo

        question_id : int
            The question for which the options are submitted
        option_data : list[OptionInput]
        """
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
                new_options.append(
                    Option(answer=data["answer"], question_id=question_id)
                )

        Option.objects.bulk_update(updated_options, fields=["answer"])
        Option.objects.bulk_create(new_options)

        return CreateUpdateAndDeleteOptions(
            options=[updated_option for updated_option in updated_options]
            + new_options,
            ok=True,
        )
