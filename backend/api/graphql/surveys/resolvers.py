from apps.surveys.models import Option, Survey, Question, Answer, Response
from guardian.shortcuts import get_objects_for_user
from graphql_jwt.decorators import login_required


from utils.decorators import permission_required


class SurveyResolvers:
    @permission_required("surveys.view_survey")
    def resolve_survey(self, info, survey_id: int):
        return Survey.objects.get(pk=survey_id)

    @permission_required("surveys.view_survey")
    def resolve_surveys(self, info):
        return Survey.objects.all()


class ResponseResolvers:
    @permission_required("surveys.manage_survey", (Survey, "responses__pk", "response_id"))
    def resolve_response(self, info, response_id):
        try:
            return Response.objects.get(pk=response_id)
        except Response.DoesNotExist:
            return None

    @permission_required("surveys.manage_survey", (Survey, "pk", "survey_id"))
    def resolve_responses(self, info, survey_id):
        return Response.objects.filter(survey__pk=survey_id)
