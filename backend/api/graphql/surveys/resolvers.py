from apps.surveys.models import (
    QuestionType,
    Option,
    Survey,
    Question,
    Answer,
)

from typing import Optional

class QuestionTypeResolvers:
    def resolve_question_type(self, info, id: int):
        return QuestionType.objects.get(pk=id)

    def resolve_question_types(self, info, search: Optional[str]=None):
        """
        TODO: Search implementation
        """
        if search:
            return QuestionType.objects.all()
        return QuestionType.objects.all()

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