from apps.forms.models import Option, Form, Question, Answer, Response
from guardian.shortcuts import get_objects_for_user
from graphql_jwt.decorators import login_required


from utils.decorators import permission_required


class FormResolvers:
    @permission_required("forms.view_form")
    def resolve_form(self, info, form_id: int):
        return Form.objects.get(pk=form_id)

    @permission_required("forms.view_form")
    def resolve_forms(self, info):
        """
        TODO: Search implementation
        """
        return Form.objects.all()


class ResponseResolvers:
    @permission_required("forms.manage_form", (Form, "responses__pk", "response_id"))
    def resolve_response(self, info, response_id):
        try:
            return Response.objects.get(pk=response_id)
        except Response.DoesNotExist:
            return None

    @permission_required("forms.manage_form", (Form, "pk", "form_id"))
    def resolve_responses(self, info, form_id):
        return Response.objects.filter(form__pk=form_id)
