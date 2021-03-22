import graphene
from graphql_jwt.decorators import login_required, permission_required

from apps.listing.models import Listing
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
        listing_id = graphene.ID(required=False)

    @login_required
    @permission_required("surveys.create_survey")
    def mutate(self, info, survey_data, listing_id=None):
        survey = Survey()
        for key, value in survey_data.items():
            setattr(survey, key, value)
        survey.save()
        if listing_id:
            listing = Listing.objects.get(pk=listing_id)
            listing.survey = survey
            listing.save()
        return CreateSurvey(survey=survey, ok=True)


class UpdateSurvey(graphene.Mutation):
    survey = graphene.Field(SurveyType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID()
        survey_data = SurveyInput(required=False)

    @login_required
    @permission_required("surveys.update_survey")
    def mutate(self, info, id, survey_data):
        survey = Survey.objects.get(pk=id)
        for key, value in survey_data.items():
            setattr(survey, key, value)
        survey.save()
        ok = True
        return UpdateSurvey(survey=survey, ok=ok)


class DeleteSurvey(graphene.Mutation):
    deleted_id = graphene.ID()
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    @permission_required("surveys.delete_survey")
    def mutate(cls, self, info, id):
        survey = Survey.objects.get(pk=id)
        deleted_id = survey.id
        survey.delete()
        return DeleteSurvey(deleted_id=deleted_id, ok=True)
