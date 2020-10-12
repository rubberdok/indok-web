from apps.surveys.models import QuestionType, OfferedAnswer

class QuestionTypeResolvers:
    def resolve_question_type(self, info, id):
        return QuestionType.objects.get(pk=id)

    def resolve_question_types(self, info, search=None):
        if search:
            return QuestionType.objects.all()
        return QuestionType.objects.all()

class OfferedAnswerResolvers:
    def resolve_offered_answer(self, info, id):
        return OfferedAnswer.objects.get(pk=id)

    def resolve_offered_answers(self, info, search=None):
        if search:
            return OfferedAnswer.objects.all()
        return OfferedAnswer.objects.all()