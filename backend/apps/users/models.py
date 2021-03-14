from django.contrib.auth.models import AbstractUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
import datetime


# Create your models here.
class User(AbstractUser):
    feide_userid = models.CharField(max_length=255, db_index=True)
    feide_email = models.EmailField(blank=True, default="")
    id_token = models.CharField(max_length=1000, blank=True, default="")
    allergies = models.CharField(max_length=1000, blank=True, default="")
    phone_number = PhoneNumberField(blank=True)
    first_login = models.BooleanField(default=True)
    graduation_year = models.IntegerField(null=True, blank=True)

    @property
    def grade_year(self):
        if not self.graduation_year:
            return None
        now = datetime.datetime.now()
        current_year = now.year
        # Users increase a grade if we are in August or later
        if now.month < 8:
            return 5 - (self.graduation_year - current_year)
        else:
            return 6 - (self.graduation_year - current_year)
