from apps.organizations.models import Organization
from django.db import models
from django.conf import settings


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
        null=True,  # TODO: Make this field conditionally required in frontend when is_attendable is True!
    )

    signed_up_users = models.ManyToManyField(  # Internal list of users who are signed up (including waiting list)
        settings.AUTH_USER_MODEL,
        related_name="events",
        blank=True,
    )

    price = models.FloatField(blank=True, null=True)

    short_description = models.CharField(max_length=100, blank=True, null=True)

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
