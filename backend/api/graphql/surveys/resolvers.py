from apps.surveys.models import Option, Survey, Question, Answer, Response
from guardian.shortcuts import get_objects_for_user
from graphql_jwt.decorators import login_required


from utils.decorators import permission_required


class SurveyResolvers:
    @permission_required("surveys.view_survey")
    def resolve_survey(self, info, survey_id: int):
        return Survey.objects.get(pk=survey_id)

    @login_required
    @permission_required("surveys.view_survey")
    def resolve_surveys(self, info, organization_id):
        return get_objects_for_user(info.context.user, "surveys.view_survey").filter(organization__pk=organization_id)


class ResponseResolvers:
    @permission_required("surveys.view_response", (Response, "pk", "response_id"))
    def resolve_response(self, info, response_id):
        return Response.objects.get(pk=response_id)

    def resolve_responses(self, info, survey_id=None):
        # Returns the responses for which the given user has permissions, filtering on survey_id if it is included.
        responses = get_objects_for_user(info.context.user, "surveys.view_response")
        if survey_id:
            return responses.filter(survey__pk=survey_id)
        return responses
