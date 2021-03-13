from apps.organizations.models import Organization
from django.db import models
from django.conf import settings
from phonenumber_field.modelfields import PhoneNumberField
from apps.users.models import User


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        # Add verbose name
        verbose_name_plural = "Categories"


class Event(models.Model):
    # Mandatory fields
    title = models.CharField(max_length=128)
    description = models.TextField()
    start_time = models.DateTimeField()
    is_attendable = models.BooleanField()
    publisher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)

    # Optional fields
    end_time = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=128, blank=True, null=True)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, blank=True, null=True
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, blank=True, null=True
    )
    image = models.URLField(blank=True, null=True)

    deadline = models.DateTimeField(blank=True, null=True)  # Deadline for signing up

    signup_open_date = models.DateTimeField(
        blank=True, null=True
    )  # When the signup should become available

    available_slots = models.PositiveIntegerField(  # maximal number of users that can sign up for an event
        blank=True,
        null=True,  # TODO: Make this field conditionally required when is_attendable is True!
    )

    price = models.FloatField(blank=True, null=True)

    short_description = models.CharField(max_length=100, blank=True, null=True)

    has_extra_information = models.BooleanField(default=False)

    @property
    def signed_up_users(self):
        sign_ups = SignUp.objects.filter(event=self, is_attending=True).order_by(
            "timestamp"
        )
        user_ids = [sign_up.user.id for sign_up in sign_ups]
        return User.objects.filter(id__in=user_ids)

    @property
    def users_on_waiting_list(self):
        result = []
        if (
            self.is_attendable
            and self.available_slots is not None
            and self.signed_up_users.count() > self.available_slots
        ):
            result = list(self.signed_up_users.all()[self.available_slots :])
        return result

    @property
    def users_attending(self):
        if self.is_attendable and self.available_slots is not None:
            return list(self.signed_up_users.all()[: self.available_slots])
        return []

    @property
    def is_full(self):
        if self.is_attendable and self.available_slots is not None:
            return self.signed_up_users.count() >= self.available_slots
        return False

    def __str__(self):
        return self.title


class SignUp(models.Model):
    timestamp = models.DateTimeField()
    is_attending = models.BooleanField()  # Whether the user is currently signed up
    extra_information = models.TextField(blank=True, default="")

    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    user_email = models.EmailField()
    user_allergies = models.CharField(max_length=1000, blank=True, default="")
    user_phone_number = PhoneNumberField()
    user_grade_year = models.IntegerField()
