import graphene

from .types import OptionType, AnswerType, FormType, QuestionType, ResponseType
from .resolvers import (
    OptionResolvers,
    ResponseResolvers,
    FormResolvers,
    QuestionResolvers,
    AnswerResolvers,
)

from .mutations.questions import (
    CreateQuestion,
    CreateUpdateAndDeleteOptions,
    DeleteAnswersToForm,
    UpdateQuestion,
    DeleteQuestion,
    DeleteAnswer,
    SubmitOrUpdateAnswers,
)

from .mutations.forms import (
    CreateForm,
    UpdateForm,
    DeleteForm,
)


class FormQueries(
    graphene.ObjectType,
    OptionResolvers,
    FormResolvers,
    QuestionResolvers,
    AnswerResolvers,
    ResponseResolvers,
):
    option = graphene.Field(OptionType, id=graphene.ID())
    options = graphene.List(OptionType, search=graphene.String())

    form = graphene.Field(FormType, form_id=graphene.ID())
    forms = graphene.List(FormType, search=graphene.String())

    question = graphene.Field(QuestionType, id=graphene.ID())
    questions = graphene.List(QuestionType, search=graphene.String())

    answer = graphene.Field(AnswerType, id=graphene.ID())
    answers = graphene.List(AnswerType, search=graphene.String())

    response = graphene.Field(
        ResponseType, form_id=graphene.ID(required=True), response_id=graphene.ID()
    )
    responses = graphene.List(ResponseType, form_id=graphene.ID(required=True))


class FormMutations(graphene.ObjectType):
    create_question = CreateQuestion.Field()
    update_question = UpdateQuestion.Field()
    delete_question = DeleteQuestion.Field()

    create_form = CreateForm.Field()
    update_form = UpdateForm.Field()
    delete_form = DeleteForm.Field()

    delete_answer = DeleteAnswer.Field()

    submit_answers = SubmitOrUpdateAnswers.Field()
    delete_answers = DeleteAnswersToForm.Field()

    create_update_and_delete_options = CreateUpdateAndDeleteOptions.Field()
