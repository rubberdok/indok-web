import datetime

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from guardian.conf import settings as guardian_settings
from django.utils import timezone


# Create your models here.
from apps.events.models import Event, SignUp


class User(AbstractUser):
    feide_userid = models.CharField(max_length=255, db_index=True)
    feide_email = models.EmailField(blank=True, default="")
    id_token = models.CharField(max_length=8000, blank=True, default="")
    allergies = models.CharField(max_length=1000, blank=True, default="")
    phone_number = PhoneNumberField(blank=True)
    first_login = models.BooleanField(default=True)
    graduation_year = models.IntegerField(null=True, blank=True)
    is_indok = models.BooleanField(default=False)
    year_updated_at = models.DateTimeField(null=True, blank=True)

    @property
    def can_update_year(self):
        return self.year_updated_at is None or (self.year_updated_at + timezone.timedelta(days=365) <= timezone.now())

    @property
    def events(self):
        sign_ups = SignUp.objects.filter(user=self, is_attending=True)
        event_ids = sign_ups.values_list("event__id", flat=True)
        return Event.objects.filter(id__in=event_ids)

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

    @property
    def is_authenticated(self) -> bool:
        return self.username != settings.ANONYMOUS_USER_NAME

    @property
    def is_anonymous(self) -> bool:
        return not self.is_authenticated

    class Meta:
        permissions = [("view_sensitive_info", "Can view sensitive information about a user")]

    def __str__(self):
        return f"User(name='{self.first_name} {self.last_name}')"


def get_anonymous_user_instance(User):
    anonymous_username = guardian_settings.ANONYMOUS_USER_NAME
    attributes = {
        "feide_userid": anonymous_username,
        User.USERNAME_FIELD: anonymous_username,
    }
    return User(**attributes)
