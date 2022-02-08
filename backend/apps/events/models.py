from typing import TYPE_CHECKING

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
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

    # ------------------ Fully optional fields ------------------
    publisher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    has_extra_information = models.BooleanField(
        default=False
    )  # If the event allows e.g. for group sign ups, this would be true (shows a text field frontend)
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
        if not hasattr(self, "attendable"):
            return []
        return (
            get_user_model()
            .objects.filter(signup__event=self.id, signup__is_attending=True)
            .order_by("signup__timestamp")
        )

    @property
    def total_allowed_grade_years(self) -> str:
        if not hasattr(self, "attendable") or self.attendable is None:
            return self.allowed_grade_years
        return self.attendable.slot_distribution.get(parent_distribution=None).grade_years

    @property
    def available_slots(self) -> int:
        if not hasattr(self, "attendable") or self.attendable is None:
            return None
        return self.attendable.slot_distribution.get(parent_distribution=None).get_available_slots()

    @property
    def users_attending(self) -> list["User"]:
        attending, _ = self.get_attendance_and_waiting_list()
        if attending is None:
            return []
        all_attending = []
        for attending_group in attending.values():
            all_attending += attending_group
        return all_attending

    @property
    def users_on_waiting_list(self) -> list["User"]:
        _, waiting_list = self.get_attendance_and_waiting_list()
        if waiting_list is None:
            return []
        all_on_waiting_list: list["User"] = []
        for waiting_list_group in waiting_list.values():
            all_on_waiting_list += waiting_list_group
        return all_on_waiting_list

    def get_attendance_and_waiting_list(self) -> tuple[dict[str, list["User"]], dict[str, list["User"]]]:
        if not hasattr(self, "attendable") or self.attendable is None:
            return None, None
        attending = {}  # keys = string of grades (category), values = userlist
        waiting_list = {}  # keys = string of grades (category), values = userlist
        self.attendable.slot_distribution.get(parent_distribution=None).get_attending(
            self.signed_up_users, attending, waiting_list
        )
        return attending, waiting_list

    def get_is_full(self, grade_year: int) -> bool:
        if not hasattr(self, "attendable") or self.attendable is None:
            return False
        attending, _ = self.get_attendance_and_waiting_list()
        available_slots = self.attendable.slot_distribution.get(parent_distribution=None).get_available_slots_for_grade(
            grade_year
        )
        for grades, users in attending.items():
            if grade_year in [int(val) for val in grades.split(",")]:
                return len(users) >= available_slots
        return False

    def is_user_allowed_to_buy_product(self, user: "User") -> bool:
        """
        Check if user is attending to determine if they are allowed to buy a ticket
        """
        from apps.events.helpers import get_attendant_group

        if self.products is None:
            return False
        attending, _ = self.get_attendance_and_waiting_list()
        attendant_group = get_attendant_group(attending, user.grade_year)
        return attendant_group is not None and user in attending[attendant_group]

    def __str__(self):
        return self.title


class Attendable(models.Model, Sellable):
    """
    Additional model used for attendable events. All attendable events have exactly one Attendable.
    Contains general information related to an attendable event.
    """

    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="attendable")
    signup_open_date = models.DateTimeField()  # When signup should become available
    binding_signup = models.BooleanField(default=False)  # Disables sign-off from users_attending if true.
    deadline = models.DateTimeField(blank=True, null=True)  # Deadline for signing up
    price = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"Attendable-{self.event.title}"


class SlotDistribution(models.Model):
    """
    Additional model used for attendable events used to keep track of the distribution of slots
    between different grade years. Each Attendable will have at least one SlotDistrbution. This is the
    parent (total) slot distribution with total available slots and total grade years that are allowed.
    The parent distribution is recognised as being the only SlotDistribution connected to the given
    Attendable that does not have a parent_distribution (parent_distribution = None). The parent distribution
    can again have a set of children, where each of these will have available slots and allowed grade years
    equal to a subset of that of the parent distribution (and they will have the parent_distirbution field set).

    """

    attendable = models.ForeignKey(Attendable, on_delete=models.CASCADE, related_name="slot_distribution")
    available_slots = models.PositiveIntegerField()
    grade_years = MultiSelectField(choices=GRADE_CHOICES, default="1,2,3,4,5")
    parent_distribution = models.ForeignKey(
        "self", on_delete=models.CASCADE, related_name="child_distributions", null=True, blank=True
    )

    @property
    def grades(self) -> list[int]:
        return [int(val) for val in str(self.grade_years).replace("[", "").replace("]", "").split(",")]

    def get_attending(self, signed_up_users: list["User"], attending: dict, waiting_list: dict):
        if not self.child_distributions.exists():
            filtered = []
            for user in signed_up_users.all():
                if user.grade_year in self.grades:
                    filtered.append(user)

            if len(filtered) >= self.available_slots:
                attending[str(self.grade_years).replace(" ", "")] = filtered[: self.available_slots]
                waiting_list[str(self.grade_years).replace(" ", "")] = filtered[self.available_slots :]
            else:
                attending[str(self.grade_years).replace(" ", "")] = filtered
                waiting_list[str(self.grade_years).replace(" ", "")] = []
            return

        for child in list(self.child_distributions.all()):
            child.get_attending(signed_up_users, attending, waiting_list)

    def get_available_slots(self):
        if not self.child_distributions.exists():
            return [{"category": str(self.grade_years).replace(" ", ""), "available_slots": self.available_slots}]

        total_available_slots = []
        for child in list(self.child_distributions.all()):
            total_available_slots.append(
                {"category": str(child.grade_years).replace(" ", ""), "available_slots": child.available_slots}
            )

        return total_available_slots

    def get_available_slots_for_grade(self, grade_year: int) -> int:
        descendants = list(self.child_distributions.all())
        while descendants:
            descendant = descendants.pop(0)
            if grade_year in descendant.grades:
                return descendant.available_slots
            if descendant.child_distributions.exists():
                descendants += list(descendant.distributions.all())

        return self.available_slots

    def __str__(self):
        if hasattr(self, "parent_distribution") and self.parent_distribution is not None:
            return f"Child slot distribution-{self.attendable.event.title}"
        return f"Slot distribution-{self.attendable.event.title}"


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
