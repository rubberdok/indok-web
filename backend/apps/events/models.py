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
    has_extra_information = models.BooleanField(
        default=False
    )  # If the event allows e.g. for group sign ups, this would be true
    end_time = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=128, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    short_description = models.CharField(max_length=100, default="Klikk her for å lese mer")
    contact_email = models.EmailField(blank=True, default="")
    allowed_grade_years = MultiSelectField(
        choices=GRADE_CHOICES, default="1,2,3,4,5"
    )  # Kept here as well in case a non-attenable (no sign up) event has grade restrictions

    @property
    def signed_up_users(self):
        if not hasattr(self, "attendable"):
            return []
        return (
            get_user_model()
            .objects.filter(signup__event=self.id, signup__is_attending=True)
            .order_by("signup__timestamp")
        )

    @property
    def total_allowed_grade_years(self):
        if not hasattr(self, "attendable"):
            return self.allowed_grade_years
        return self.attendable.slot_distribution.available_slots

    @property
    def available_slots(self):
        if not hasattr(self, "attendable"):
            return None
        return self.attendable.slot_distribution.get_available_slots()

    def get_attendance_and_waiting_list(self):
        attending = {}  # keys = string of grades (category), values = userlist
        waiting_list = {}  # keys = string of grades (category), values = userlist
        self.attendable.slot_distribution.get_attendants(self.signed_up_users, attending, waiting_list)
        return attending, waiting_list

    def get_is_full(self, grade_year):
        attending, _ = self.get_attendance_and_waiting_list()
        available_slots = self.attendable.slot_distribution.get_available_slots_for_grade(grade_year)
        for grades, users in attending.items():
            if grade_year in [int(val) for val in grades.split(",")]:
                return len(users) > available_slots
        return False

    def __str__(self):
        return self.title


class Attendable(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="attendable")
    signup_open_date = models.DateTimeField()  # When signup should become available
    binding_signup = models.BooleanField(default=False)  # Disables sign-off from users_attending if true.
    deadline = models.DateTimeField(blank=True, null=True)  # Deadline for signing up
    price = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"Attendable-{self.event.title}"


class SlotDistribution(models.Model):
    attendable = models.ForeignKey(Attendable, on_delete=models.CASCADE, related_name="slot_distribution")
    available_slots = models.PositiveIntegerField()
    grade_years = MultiSelectField(choices=GRADE_CHOICES, default="1,2,3,4,5")
    parent_distribution = models.ForeignKey(
        "self", on_delete=models.CASCADE, related_name="child_distributions", null=True, blank=True
    )

    def grades(self):
        return [int(val) for val in self.grade_years.split(",")]

    def get_attending(self, signed_up_users, attending, waiting_list):
        if len(self.children) == 0:
            filtered = list(signed_up_users.filter(grade_year__in=self.grades))
            if len(filtered) >= self.available_slots:
                attending[self.grade_years] = filtered[: self.available_slots]
                waiting_list[self.grade_years] = filtered[self.available_slots :]
            else:
                attending[self.grade_years] = filtered
            return

        for child in self.child_distributions:
            child.get_attending(signed_up_users, attending, waiting_list)

    def get_available_slots(self):
        if len(self.child_distributions) == 0:
            return [{"category": self.grade_years, "available_slots": self.available_slots}]

        total_available_slots = []
        for child in self.child_distributions:
            total_available_slots.append({"category": child.grade_years, "available_slots": child.available_slots})

        return total_available_slots

    def get_available_slots_for_grade(self, grade_year):
        descendants = list(self.child_distributions)
        while descendants:
            descendant = descendants.pop(0)
            if grade_year in descendant.grades:
                return descendant.available_slots
            if len(descendant.children) > 0:
                descendants += list(descendant.children)

        return self.available_slots

    def __str__(self):
        return f"{'Child slot distribution' if hasattr(self, 'parent_distribution') else 'Slot distribution'}-{self.attendable.event.title}"


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

    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    user_email = models.EmailField()
    user_allergies = models.CharField(max_length=1000, blank=True, default="")
    user_phone_number = PhoneNumberField()
    user_grade_year = models.IntegerField()

    def __str__(self):
        return f"{self.user.username}-{self.event.title}"
