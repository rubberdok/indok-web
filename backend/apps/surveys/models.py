import uuid

from django.conf import settings
from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.constraints import CheckConstraint
from django.db.models.fields import UUIDField
from django.db.models.query_utils import Q
from django.utils.translation import gettext_lazy as _

from apps.organizations.models import Organization


class Survey(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    descriptive_name = models.CharField(max_length=100)
    description = models.CharField(max_length=3000, blank=True, default="")

    def __str__(self) -> str:
        return f"{self.descriptive_name}"

    @property
    def mandatory_questions(self):
        return self.questions.filter(mandatory=True)

class Question(models.Model):
    PARAGRAPH = "Paragraph"
    SHORT_ANSWER = "Short answer"
    DROPDOWN = "Drop-down"
    MCQ = "Multiple choice"
    CHECKBOX = "Checkboxes"
    SLIDER = "Slider"
    FILE_UPLOAD = "File upload"

    QUESTION_TYPE_CHOICES = [
        (PARAGRAPH, "Paragraph"),
        (SHORT_ANSWER, "Short answer"),
        (DROPDOWN, "Drop-down"),
        (MCQ, "Multiple choice"),
        (CHECKBOX, "Checkboxes"),
        (SLIDER, "Slider"),
        (FILE_UPLOAD, "File upload")
    ]
        

    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name="questions")
    question = models.CharField(max_length=300)
    description = models.CharField(max_length=1000, blank=True, default="")
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES, default=PARAGRAPH)
    position = models.IntegerField()
    mandatory = models.BooleanField(default=True)


    def __str__(self) -> str:
        return f"{self.survey}: {self.question}"

    class Meta:
        ordering = ["position"]
        constraints = [
            UniqueConstraint(fields=["position", "survey"], name="unique question position per survey"),
        ]

class Option(models.Model):
    answer = models.CharField(max_length=500)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")

    def __str__(self) -> str:
        return f"{self.answer}"

class Answer(models.Model):
    uuid = UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    response = models.ForeignKey("Response", on_delete=models.CASCADE, related_name="answers")
    
    answer = models.CharField(max_length=10000)

    class Meta:
        constraints = [
            UniqueConstraint(fields=["user", "question"], name="unique_answer_to_question_per_user"),
            CheckConstraint(check=~Q(answer=""), name="answer_not_empty")
        ]

    def __str__(self) -> str:
        return f"User: {self.user}; Answer: {self.answer}"

class QuestionType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return f"{self.name}"

class Response(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    respondent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="responses")
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name="responses")

    class Status(models.IntegerChoices):
        RED = 0, _("Red")
        YELLOW = 1, _("Yellow")
        GREEN = 2, _("Green")
        
        __empty__ = _("Unknown")

    class Meta:
        constraints = [
            UniqueConstraint(fields=["respondent", "survey"], name="only_one_response_per_survey")
        ]

    status = models.IntegerField(choices=Status.choices, blank=True, null=True)

class Comment(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    response = models.ForeignKey(Response, on_delete=models.CASCADE, related_name="comments")
    comment = models.CharField(max_length=2048)
