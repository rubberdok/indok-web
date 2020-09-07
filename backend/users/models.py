from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField("Username", max_length=50)
    year = models.IntegerField()
