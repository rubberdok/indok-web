from django.db import models
from apps.organizations.models import Organization
from apps.users.models import User


# Create your models here.
class Survey(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    descriptive_name = models.CharField(max_length=100)
    description = models.CharField(max_length=3000, blank=True, default="")
    question = models.ManyToManyField("Question", related_name="surveys")

class Question(models.Model):
    question = models.CharField(max_length=300)
    description = models.CharField(max_length=1000, blank=True, default="")
    slug = models.CharField(max_length=300, blank=True, default="")
    offered_answer = models.ManyToManyField("OfferedAnswer", related_name="questions")

class OfferedAnswer(models.Model):
    answer = models.CharField(max_length=500)

class Answer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    survey = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=10000)

class QuestionType(models.Model):
    descriptive_name = models.CharField(max_length=100)