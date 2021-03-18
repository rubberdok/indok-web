from apps.surveys.models import (
    Option,
    Survey,
    Question,
    Answer,
    Response
)

from typing import Optional

class OptionResolvers:
    def resolve_offered_answer(self, info, id: int):
        return Option.objects.get(pk=id)

    def resolve_offered_answers(self, info, search: Optional[str]=None):
        """
        TODO: Search implementation
        """
        if search:
            return Option.objects.all()
        return Option.objects.all()

class SurveyResolvers:
    def resolve_survey(self, info, survey_id: int):
        return Survey.objects.get(pk=survey_id)

    def resolve_surveys(self, info, search: Optional[str]=None):
        """
        TODO: Search implementation
        """
        return Survey.objects.all()

class QuestionResolvers:
    def resolve_question(self, info, id: int):
        return Question.objects.get(pk=id)

    def resolve_questions(self, info, search: Optional[str]=None):
        """
        TODO: Search implementation
        """
        return Question.objects.all()

class AnswerResolvers:
    def resolve_answer(self, info, id: int):
        return Answer.objects.get(pk=id)

    def resolve_answers(self, info, search: Optional[str]=None):
        """
        TODO: Search implementation
        """
        return Answer.objects.all()

class ResponseResolvers:
    def resolve_response(self, info, survey_id, response_id=None):
        try:
            if response_id:
                return Response.objects.get(pk=response_id)
            return Response.objects.get(survey__pk=survey_id, responder=info.context.user)
        except Response.DoesNotExist:
            raise KeyError("No such response found.")
    
    def resolve_responses(self, info, survey_id):
        # TODO: Permissions
        return Response.objects.filter(survey__pk=survey_id)
                
