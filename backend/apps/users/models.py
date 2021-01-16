from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    year = models.IntegerField(null=True, blank=True)
    feide_userid = models.CharField(max_length=255, db_index=True)
