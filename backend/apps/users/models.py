from django.contrib.auth.models import AbstractUser
from django.db import models

from phonenumber_field.modelfields import PhoneNumberField

# TODO: install https://pypi.org/project/django-phonenumber-field/

# Create your models here.
class User(AbstractUser):
    year = models.IntegerField(null=True, blank=True)
    feide_userid = models.CharField(max_length=255, db_index=True)
    feide_email = models.CharField(null=True, blank=True)
    id_token = models.CharField(max_length=1000, null=True, blank=True)
    allergies = models.CharField(null=True, blank=True)
    phone_number = models.PhoneNumberField(_(""))