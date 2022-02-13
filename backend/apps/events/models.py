from typing import TYPE_CHECKING

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from apps.events.helpers import get_attendant_group
from multiselectfield import MultiSelectField
from phonenumber_field.modelfields import PhoneNumberField

from apps.ecommerce.mixins import Sellable
from apps.organizations.models import Organization

if TYPE_CHECKING:
    from apps.users.models import User


class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


GRADE_CHOICES = ((1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5"))


class Event(models.Model):
    """
    Main model for events. Has the general information about all events (regardless of
    whether they are attendable or not)
    """

    # ------------------ Mandatory fields ------------------
    title = models.CharField(max_length=128)
    description = models.TextField()
    start_time = models.DateTimeField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="events")

    # ------------------ Optional fields ------------------
    publisher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=128, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    short_description = models.CharField(max_length=100, default="Klikk her for å lese mer")
    contact_email = models.EmailField(blank=True, default="")
    allowed_grade_years = MultiSelectField(
        choices=GRADE_CHOICES, default="1,2,3,4,5"
    )  # Kept here as well in case a non-attenable (no sign up) event has grade restrictions
    products = GenericRelation("ecommerce.Product")

    @property
    def signed_up_users(self) -> list["User"]:
        if not hasattr(self, "attendable") or self.attendable is None:
            return []
        return (
            get_user_model()
            .objects.filter(signup__event=self.id, signup__is_attending=True)
            .order_by("signup__timestamp")
        )

    @property
    def allowed_grade_years_string(self) -> str:
        string = ""
        for grade_year in self.allowed_grade_years:
            string += str(grade_year) + ","
        return string[:-1]

    def is_user_allowed_to_buy_product(self, user: "User") -> bool:
        """
        Check if user is attending to determine if they are allowed to buy a ticket
        """
        if self.products is None:
            return False
        return user in self.attendable.users_attending

    def __str__(self):
        return self.title


class Attendable(models.Model, Sellable):
    """
    Additional model used for attendable events. All attendable events have exactly one Attendable.
    Contains general information related to an attendable event.
    """

    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="attendable")
    signup_open_date = models.DateTimeField()  # When signup should become available
    total_available_slots = models.PositiveIntegerField()  # Total number of available slots on the event
    slot_distribution = models.JSONField(
        default=dict
    )  # Dict with grade groups as keys and number of slots as values, e.g. {"1,2": 100, "3": 50}. If there
    # is no distribution, there will only be one element: {"1,2,3": 150}
    binding_signup = models.BooleanField(default=False)  # Disables sign-off from users_attending if true.
    deadline = models.DateTimeField(blank=True, null=True)  # Deadline for signing up
    price = models.FloatField(blank=True, null=True)  # Price if you need to pay to attend an event
    has_extra_information = models.BooleanField(
        default=False
    )  # If the event need users to give extra information when signing up, e.g. for group sign ups (email
    # of everyone in the group), this would be true (shows a text field frontend)

    def get_attendance_and_waiting_list(self):  # TODO: Typedict this
        """
        Method for creating two dicts with grades as keys and a list of users as values. One for attending
        users and one for users on waiting list.
        """
        if len(self.slot_distribution) == 1:
            # There is no distribution for different grades
            attending = {
                self.event.allowed_grade_years_string: self.event.signed_up_users[0 : self.total_available_slots]
            }
            waiting_list = {
                self.event.allowed_grade_years_string: self.event.signed_up_users[self.total_available_slots :]
            }
            return attending, waiting_list

        attending = {}
        waiting_list = {}
        for grades in self.slot_distribution.keys():
            attending[grades] = []
            waiting_list[grades] = []

        total = 0

        # Go through the users in the order they signed up
        for user in self.event.signed_up_users:
            for grades in self.slot_distribution.keys():
                if str(user.grade_year) not in grades:
                    continue

                # If the slots for the grade is full or the event in total is full, put user in waiting list
                elif (
                    len(attending[grades]) >= len(self.slot_distribution[grades]) or total >= self.total_available_slots
                ):
                    waiting_list[grades].append(user)

                # Else put user in attending list
                else:
                    attending[grades].append(user)
                    total += 1

        return attending, waiting_list

    @property
    def users_attending(self) -> list["User"]:
        """
        Method for getting a list of all users that are attending (have a slot)
        """
        attending, _ = self.get_attendance_and_waiting_list()
        if attending is None:
            return []
        all_attending = []
        for attending_group in attending.values():
            all_attending += attending_group
        return all_attending

    @property
    def users_on_waiting_list(self) -> list["User"]:
        """
        Method for getting a list of all users on waiting list
        """
        _, waiting_list = self.get_attendance_and_waiting_list()
        if waiting_list is None:
            return []
        all_on_waiting_list: list["User"] = []
        for waiting_list_group in waiting_list.values():
            all_on_waiting_list += waiting_list_group
        return all_on_waiting_list

    def get_is_full(self, grade_year: int) -> bool:
        """
        Method for checking if the event is full for a specific grade year. This can happen in two ways,
        since we allow the sum of available slots for each grade group in self.slot_distribution to be
        greater than the total number of available slots on the event:
            - The total number of users attending is equal to the total number of available slots
            - The number of users in the specific grade group is equal to the number of available slots
        """

        if len(self.users_attending) == self.total_available_slots:
            return True

        attending, _ = self.get_attendance_and_waiting_list()
        grade_group = get_attendant_group(list(self.slot_distribution.keys()), grade_year)

        if grade_group is None:
            return False

        if len(attending[grade_group]) == self.slot_distribution[grade_group]:
            return True

        return False

    def __str__(self):
        return f"Attendable-{self.event.title}"


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
