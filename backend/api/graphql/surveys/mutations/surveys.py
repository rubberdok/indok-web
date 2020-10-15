import graphene

from apps.surveys.models import Survey
from ..types import SurveyType

class SurveyInput(graphene.InputObjectType):
    descriptive_name = graphene.String(required=False)
    organization_id = graphene.ID(required=False)
    description = graphene.String(required=False)


class CreateSurvey(graphene.Mutation):
    survey = graphene.Field(SurveyType)
    ok = graphene.Boolean()

    class Arguments:
        survey_data = SurveyInput(required=False)

    @classmethod
    def mutate(cls, info, survey_data):
        survey = Survey()
        for key, value in survey_data.items():
            setattr(survey, key, value)
        survey.save()
        ok = True
        return cls(survey=survey, ok=ok)


class UpdateSurvey(graphene.Mutation):
    survey = graphene.Field(SurveyType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID()
        survey_data = SurveyInput(required=False)

    @classmethod
    def mutate(cls, info, id, survey_data):
        survey = Survey.objects.get(pk=id)
        for key, value in survey_data.items():
            setattr(survey, key, value)
        survey.save()
        ok = True
        return cls(survey=survey, ok=ok)


class DeleteSurvey(graphene.Mutation):
    deleted_id = graphene.ID()
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    @classmethod
    def mutate(cls, info, id):
        survey = Survey.objects.get(pk=id)
        deleted_id = survey.id
        survey.delete()
        ok = True
        return cls(deleted_id=deleted_id, ok=ok)