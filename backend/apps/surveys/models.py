from django.db import models
from apps.organizations.models import Organization
from apps.users.models import User


# Create your models here.
class Survey(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    descriptive_name = models.CharField(max_length=100)
    description = models.CharField(max_length=3000, blank=True, default="")
    question = models.ManyToManyField("Question", through="SurveyQuestion", related_name="surveys")

    def __str__(self):
        return self.descriptive_name

class SurveyQuestion(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    question = models.ForeignKey("Question", on_delete=models.CASCADE)
    offered_answer = models.ManyToManyField("OfferedAnswer", related_name="surveyquestions")
    question_type = models.ForeignKey("QuestionType", on_delete=models.SET_NULL, null=True)

class Question(models.Model):
    question = models.CharField(max_length=300)
    description = models.CharField(max_length=1000, blank=True, default="")
    slug = models.CharField(max_length=300, blank=True, default="")

    def __str__(self):
        return f"Question: {self.question}"

class OfferedAnswer(models.Model):
    answer = models.CharField(max_length=500)

    def __str__(self):
        return self.answer

class Answer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    answer = models.CharField(max_length=10000)

    def __str__(self):
        return f"Survey: {self.survey}; User: {self.user}; Question: {self.question}; Answer: {self.answer}"

class QuestionType(models.Model):
    descriptive_name = models.CharField(max_length=100)

    def __str__(self):
        return self.descriptive_name