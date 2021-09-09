import graphene

from .types import FormType, ResponseType
from .resolvers import (
    ResponseResolvers,
    FormResolvers,
)

from .mutations.forms import CreateForm, DeleteForm, UpdateForm
from .mutations.questions import (
    CreateQuestion,
    CreateUpdateAndDeleteOptions,
    DeleteAnswer,
    DeleteAnswersToForm,
    DeleteQuestion,
    SubmitOrUpdateAnswers,
    UpdateQuestion,
)
from .resolvers import (
    FormResolvers,
    ResponseResolvers,
)


class FormQueries(
    graphene.ObjectType,
    FormResolvers,
    ResponseResolvers,
):
    form = graphene.Field(FormType, form_id=graphene.ID())
    forms = graphene.List(FormType)

    response = graphene.Field(ResponseType, form_id=graphene.ID(required=True), response_id=graphene.ID())
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
