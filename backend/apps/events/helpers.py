from django.core.exceptions import ValidationError
from .models import Attendable, SlotDistribution, Event
from typing import TypedDict, Optional
from datetime import datetime


class GradeDistributionData(TypedDict):
    category: str
    grades: int


class AttendableData(TypedDict):
    signup_open_date: datetime
    binding_signup: Optional[bool]
    deadline: Optional[datetime]
    price: Optional[float]


class SlotDistributionData(TypedDict):
    available_slots: int
    grade_years: Optional[list[GradeDistributionData]]


def create_attendable(attendable_data: AttendableData, event: Event) -> Attendable:
    attendable = Attendable()
    for k, v in attendable_data.items():
        setattr(attendable, k, v)
    setattr(attendable, "event", event)
    attendable.save()
    return attendable


def create_child_slot_distributions(
    grade_dist_data: list[GradeDistributionData], attendable: Attendable, slot_distribution: SlotDistribution
) -> list[SlotDistribution]:
    child_dists: list[SlotDistribution] = []

    # We keep track of the total grades allowed and total available slots to
    # update the parent distribution afterwards
    total_grades_allowed: str = ""
    total_child_slots: int = 0

    # Go through the distributions in grade_dist_data
    for dist in grade_dist_data:
        # Add the category (grades allowed in this distribution) and slots to the total
        # (Used to update parent distribution later)
        total_grades_allowed += dist.category + ","
        total_child_slots += dist.available_slots

        # Create a slot distribution
        child = SlotDistribution.objects.create(
            attendable=attendable, available_slots=dist.available_slots, grade_years=dist.category
        )
        # Add the child distribution to the list
        child_dists.append(child)

    # Use all of the grades that are allowed to check that the same grade is not in
    # multiple different distributions
    total_grades_allowed = total_grades_allowed[:-1]
    listed_total_grades_allowed: list[int] = [int(val) for val in total_grades_allowed.split(",")]
    if len(set(listed_total_grades_allowed)) != len(listed_total_grades_allowed):
        raise ValidationError("Samme trinn kan ikke være i flere 'Antall plasser'-kategorier")

    # Make sure thatthe distributions of slots equal the total available slots found
    # in the parent distribution
    if total_child_slots != slot_distribution.available_slots:
        raise ValidationError("Totalt antall plasser stemmer ikke overens med fordelingen av plasser")

    # Set grade_years on the parent distribution (all grades allowed at the event) equal to the
    # string of categories we collected when creating child distributions
    setattr(slot_distribution, "grade_years", total_grades_allowed)

    return child_dists


def create_slot_distributions(slot_distribution_data: SlotDistributionData, attendable: Attendable) -> SlotDistribution:
    child_dists: list[SlotDistribution] = []

    # Extract grade distributions
    grade_dist_data: list[GradeDistributionData] = (
        slot_distribution_data.pop("grade_years") if hasattr(slot_distribution_data, "grade_years") else None
    )

    # Create parent distribution
    slot_distribution = SlotDistribution()
    for k, v in slot_distribution_data.items():
        setattr(slot_distribution, k, v)
    setattr(slot_distribution, "attendable", attendable)

    # Create child distributions if different grades have a specfic number of slots
    if grade_dist_data:
        child_dists: list[SlotDistribution] = create_child_slot_distributions(
            grade_dist_data, attendable, slot_distribution
        )
    else:
        setattr(slot_distribution, "grade_years", attendable.event.allowed_grade_years)

    slot_distribution.save()

    for child in child_dists:
        setattr(child, "parent_distribution", slot_distribution)
        child.save()

    return slot_distribution


def update_slot_distributions(
    slot_distribution_data: SlotDistributionData, slot_distribution: SlotDistribution
) -> SlotDistribution:
    # Extract grade distributions
    grade_dist_data: list[GradeDistributionData] = (
        slot_distribution_data.pop("grade_years") if hasattr(slot_distribution_data, "grade_years") else None
    )
    # Update parent distribution
    for k, v in slot_distribution_data.items():
        setattr(slot_distribution, k, v)
    slot_distribution.save()

    # Update child distributions
    if grade_dist_data:
        # Delete the current children and create new ones:
        slot_distribution.child_distributions.all().delete()

        # Create new ones for the new grade_dist_data:
        child_dists = create_child_slot_distributions(grade_dist_data, slot_distribution.attendable, slot_distribution)

        # Set the parent distribution of all the child distributions (if any where created)
        for child in child_dists:
            setattr(child, "parent_distribution", slot_distribution)
            child.save()

    slot_distribution.save()

    return slot_distribution
