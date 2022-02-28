import graphene
from graphql_jwt.decorators import login_required
from utils.decorators import permission_required
from django.db.models import Q
from django.db import IntegrityError
from django.utils import timezone

from apps.forms.models import Answer, Option, Question, Response, Form
from apps.forms.types import OptionType, QuestionType, QuestionTypeEnum


class BaseQuestionInput(graphene.InputObjectType):
    question_type = graphene.Field(QuestionTypeEnum)
    question = graphene.String()
    description = graphene.String()
    mandatory = graphene.Boolean()


class CreateQuestionInput(BaseQuestionInput):
    question = graphene.String(required=True)
    mandatory = graphene.Boolean()


class CreateQuestion(graphene.Mutation):
    ok = graphene.Boolean()
    question = graphene.Field(QuestionType)

    class Arguments:
        form_id = graphene.ID()
        question_data = CreateQuestionInput(required=True)

    @permission_required("forms.change_form", (Form, "pk", "form_id"))
    def mutate(self, info, form_id, question_data):
        question = Question()
        for k, v in question_data.items():
            # Necessary as graphene-django passes None into kwargs if no value is submitted.
            # Can be removed if https://github.com/graphql-python/graphene/pull/1300 is merged
            if v is not None:
                setattr(question, k, v)
        question.form_id = form_id
        question.save()
        return CreateQuestion(question=question, ok=True)


class UpdateQuestion(graphene.Mutation):
    ok = graphene.Boolean()
    question = graphene.Field(QuestionType)

    class Arguments:
        id = graphene.ID(required=True)
        question_data = BaseQuestionInput(required=True)

    @permission_required("forms.change_form", (Form, "questions__pk", "id"))
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

    @permission_required("forms.change_form", (Form, "questions__pk", "id"))
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
    def mutate(self, info, uuid):
        user = info.context.user
        try:
            answer = user.answers.get(pk=uuid)
        except Answer.DoesNotExist:
            return DeleteAnswer(deleted_uuid=None, ok=False)
        deleted_uuid = answer.pk
        if answer.question.mandatory:
            return DeleteAnswer(deleted_uuid=None, ok=False)
        answer.delete()
        return DeleteAnswer(ok=True, deleted_uuid=deleted_uuid)


class SubmitOrUpdateAnswers(graphene.Mutation):
    ok = graphene.Boolean()
    message = graphene.String(required=False)

    class Arguments:
        form_id = graphene.ID(required=True)
        answers_data = graphene.List(AnswerInput)

    @permission_required(["forms.add_answer", "forms.change_answer"])
    def mutate(self, info, form_id, answers_data):
        """Creates new answers to previously unanswered questions, updates already existings answers.

        Parameters
        ----------
        info : GraphQLResolveInfo

        form_id : int
            The ID of the form to which the answers are submitted
        answers_data : list[AnswerInput]

        Raises
        ------
        KeyError
            If the form is not found
        AssertionError
            If not all mandatory questions have been answered
        """
        user = info.context.user
        try:
            form: Form = Form.objects.prefetch_related("questions").get(pk=form_id)
        except Form.DoesNotExist:
            raise KeyError(f"The form with id {form_id} does not exist.")

        if form.listing and form.listing.deadline <= timezone.now():
            return SubmitOrUpdateAnswers(
                ok=False,
                message=(
                    "Søknadsfristen har utløpt og det er ikke lenger mulig å sende inn eller endre svar på denne søknaden."  # noqa
                ),
            )

        response, _ = Response.objects.prefetch_related("answers").get_or_create(form_id=form_id, respondent=user)

        # Restructure the data for easier manipulation
        answers = {int(answer_data["question_id"]): answer_data["answer"] for answer_data in answers_data}
        existing_answers = response.answers.distinct()
        updated_existing_answers = list(existing_answers.filter(question__pk__in=answers.keys()))
        for answer in updated_existing_answers:
            answer.answer = answers[answer.question.pk]

        # A mandatory question is unanswered if:
        # (1) it is in the form
        # (2) it is mandatory
        # (3) it is not in the list of existing answers
        # (4) it is not part of the new, incoming answers
        unanswered_mandatory_questions = form.questions.filter(
            Q(mandatory=True)
            & ~Q(pk__in=existing_answers.values_list("question__id", flat=True))
            & ~Q(pk__in=answers.keys())
        ).exists()

        assert not unanswered_mandatory_questions

        # Iterate over the questions to prevent users from answering other forms than the current one
        questions = form.questions.filter(
            Q(pk__in=answers.keys()) & ~Q(pk__in=existing_answers.values_list("question__id", flat=True))
        )
        try:
            Answer.objects.bulk_update(updated_existing_answers, ["answer"])
            Answer.objects.bulk_create(
                [
                    Answer(
                        response=response,
                        question=question,
                        answer=answers[question.pk],
                    )
                    for question in questions
                    if question.mandatory or answers[question.pk] != ""
                ]
            )
        except IntegrityError as err:
            if "answer_not_empty" in err.args[0]:
                return SubmitOrUpdateAnswers(ok=False, message="Du må svare på alle obligatoriske spørsmål.")
            else:
                raise err
        return SubmitOrUpdateAnswers(ok=True)


class DeleteAnswersToForm(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        form_id = graphene.ID()

    @login_required
    def mutate(self, info, form_id):
        user = info.context.user
        user.responses.get(form_id=form_id).delete()
        return DeleteAnswersToForm(ok=True)


class OptionInput(graphene.InputObjectType):
    answer = graphene.String(required=True)
    id = graphene.ID()


class CreateUpdateAndDeleteOptions(graphene.Mutation):
    ok = graphene.Boolean()
    options = graphene.List(OptionType)

    class Arguments:
        question_id = graphene.ID(required=True)
        option_data = graphene.List(OptionInput)

    @permission_required("forms.change_form", (Form, "questions__pk", "question_id"))
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
                new_options.append(Option(answer=data["answer"], question_id=question_id))

        Option.objects.bulk_update(updated_options, fields=["answer"])
        Option.objects.bulk_create(new_options)

        return CreateUpdateAndDeleteOptions(
            options=[updated_option for updated_option in updated_options] + new_options,
            ok=True,
        )
