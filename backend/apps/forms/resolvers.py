from .models import Option, Form, Question, Answer, Response

from typing import Optional


class OptionResolvers:
    def resolve_offered_answer(self, info, id: int):
        return Option.objects.get(pk=id)

    def resolve_offered_answers(self, info, search: Optional[str] = None):
        """
        TODO: Search implementation
        """
        return Option.objects.all()


class FormResolvers:
    def resolve_form(self, info, form_id: int):
        return Form.objects.get(pk=form_id)

    def resolve_forms(self, info, search: Optional[str] = None):
        """
        TODO: Search implementation
        """
        return Form.objects.all()


class QuestionResolvers:
    def resolve_question(self, info, id: int):
        return Question.objects.get(pk=id)

    def resolve_questions(self, info, search: Optional[str] = None):
        """
        TODO: Search implementation
        """
        return Question.objects.all()


class AnswerResolvers:
    def resolve_answer(self, info, id: int):
        # TODO: Row level permissions
        if info.context.user.is_superuser:
            return Answer.objects.get(pk=id)
        else:
            raise NotImplementedError("Dette kallet er ikke implementert enda.")

    def resolve_answers(self, info, search: Optional[str] = None):
        """
        TODO:
        - Search
        - Row level permissions
        """
        if info.context.user.is_supseruser:
            return Answer.objects.all()
        else:
            raise NotImplementedError("Dette kallet er ikke implementert enda.")


class ResponseResolvers:
    def resolve_response(self, info, form_id, response_id=None):
        # TODO: Row level permissions
        if info.context.user.is_superuser:
            try:
                if response_id:
                    return Response.objects.get(pk=response_id)
                return Response.objects.get(
                    form__pk=form_id, responder=info.context.user
                )
            except Response.DoesNotExist:
                return None
        else:
            raise NotImplementedError("Dette kallet er ikke implementert enda.")

    def resolve_responses(self, info, form_id):
        # TODO: Row level permissions
        if info.context.user.is_supseruser:
            return Response.objects.filter(form__pk=form_id)
        else:
            raise NotImplementedError("Dette kallet er ikke implementert enda.")
