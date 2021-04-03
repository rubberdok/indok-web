import graphene

from .types import OptionType, AnswerType, SurveyType, QuestionType, ResponseType
from .resolvers import (
    ResponseResolvers,
    SurveyResolvers,
)

from .mutations.questions import (
    CreateQuestion,
    CreateUpdateAndDeleteOptions,
    DeleteAnswersToSurvey,
    UpdateQuestion,
    DeleteQuestion,
    DeleteAnswer,
    SubmitOrUpdateAnswers,
)

from .mutations.surveys import (
    CreateSurvey,
    UpdateSurvey,
    DeleteSurvey,
)


class SurveyQueries(
    graphene.ObjectType,
    SurveyResolvers,
    ResponseResolvers,
):
    survey = graphene.Field(SurveyType, survey_id=graphene.ID())
    surveys = graphene.List(SurveyType, search=graphene.String())

    response = graphene.Field(
        ResponseType, survey_id=graphene.ID(required=True), response_id=graphene.ID()
    )
    responses = graphene.List(ResponseType, survey_id=graphene.ID(required=True))


class SurveyMutations(graphene.ObjectType):
    create_question = CreateQuestion.Field()
    update_question = UpdateQuestion.Field()
    delete_question = DeleteQuestion.Field()

    create_survey = CreateSurvey.Field()
    update_survey = UpdateSurvey.Field()
    delete_survey = DeleteSurvey.Field()

    delete_answer = DeleteAnswer.Field()

    submit_answers = SubmitOrUpdateAnswers.Field()
    delete_answers = DeleteAnswersToSurvey.Field()

    create_update_and_delete_options = CreateUpdateAndDeleteOptions.Field()
