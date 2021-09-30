from apps.organizations.models import Organization
from django.db import models
from django.conf import settings
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth import get_user_model
from multiselectfield import MultiSelectField


class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


GRADE_CHOICES = ((1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5"))


class Event(models.Model):
    # ------------------ Mandatory fields ------------------
    title = models.CharField(max_length=128)
    description = models.TextField()
    start_time = models.DateTimeField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="events")

    # ------------------ Fully optional fields ------------------
    publisher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
    )
    end_time = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=128, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    short_description = models.CharField(max_length=100, default="Klikk her for å lese mer")
    contact_email = models.EmailField(blank=True, default="")
    allowed_grade_years = MultiSelectField(choices=GRADE_CHOICES, default="1,2,3,4,5")

    def __str__(self):
        return self.title


class AttendableEvent(Event):
    signup_open_date = models.DateTimeField()  # When signup should become available

    available_slots = models.PositiveIntegerField()  # maximal number of users that can sign up for an event T
    available_slots_1st_year = models.PositiveIntegerField(blank=True, null=True)  # maximal number of 1st years
    available_slots_2nd_year = models.PositiveIntegerField(blank=True, null=True)  # maximal number of 2nd years
    available_slots_3rd_year = models.PositiveIntegerField(blank=True, null=True)  # maximal number of 3rd years
    available_slots_4th_year = models.PositiveIntegerField(blank=True, null=True)  # maximal number of 4th years
    available_slots_5th_year = models.PositiveIntegerField(blank=True, null=True)  # maximal number of 5 years

    binding_signup = models.BooleanField(
        default=False
    )  # Disables sign-off from users_attending if true. NOTE: binding_signup is required given Price

    deadline = models.DateTimeField(blank=True, null=True)  # Deadline for signing up
    price = models.FloatField(blank=True, null=True)

    @property
    def available_slots_distribution(self):
        slot_dist = []
        for slots in [
            self.available_slots_1st_year,
            self.available_slots_2nd_year,
            self.available_slots_3rd_year,
            self.available_slots_4th_year,
            self.available_slots_5th_year,
        ]:
            if slots is None:
                return None  # No distribution selected
            slot_dist.append(slots)
        return slot_dist

    @property
    def signed_up_users(self):
        return (
            get_user_model()
            .objects.filter(signup__event=self.id, signup__is_attending=True)
            .order_by("signup__timestamp")
        )

    @property
    def users_on_waiting_list(self):
        result = []
        if self.signed_up_users.count() > self.available_slots:
            result = list(self.signed_up_users.all()[self.available_slots :])
        return result

    @property
    def users_attending(self):
        return list(self.signed_up_users.all()[: self.available_slots])

    @property
    def is_full(self):
        return self.signed_up_users.count() >= self.available_slots


class SlotDistribution(models.Model):
    event = models.ForeignKey(AttendableEvent, on_delete=models.CASCADE)
    available_slots = models.PositiveIntegerField()
    grade = models.CharField(max_length=6, choices=GRADE_CHOICES)
    parent_distribution = models.ForeignKey(
        "self", on_delete=models.CASCADE, related_name="child_distributions", null=True, blank=True
    )


class SignUp(models.Model):
    """
    Intermediary model between users and events representing a single sign up.
    The signups for an event represent users that are attending and those on the waiting list.
    Attending lists and waiting lists are inferred based on the signups and the set available slots.
    If a user sings off (meld av), a new row is added if they sign up again.
    For history's sake, old rows are kept upon sign-off, but is_attending is set to False.
    """

    timestamp = models.DateTimeField()
    is_attending = models.BooleanField()
    extra_information = models.TextField(blank=True, default="")

    event = models.ForeignKey(AttendableEvent, on_delete=models.CASCADE)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    user_email = models.EmailField()
    user_allergies = models.CharField(max_length=1000, blank=True, default="")
    user_phone_number = PhoneNumberField()
    user_grade_year = models.IntegerField()

    def __str__(self):
        return f"{self.user.username}-{self.event.title}"
