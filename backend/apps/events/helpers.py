from __future__ import annotations
from typing import TypedDict, Optional, Union
from datetime import datetime


class GradeDistributionData(TypedDict):
    category: str
    grades: int


class AttendableData(TypedDict):
    signup_open_date: datetime
    binding_signup: Optional[bool]
    deadline: Optional[datetime]
    price: Optional[float]


def get_attendant_group(grade_groups, grade_year: int) -> Union[str, None]:
    """
    Get the grade group that a grade_year is included in

    Args:
        attending_dict ([type]): list of grades (string) e.g. ["1,2", "3", "4,5"]
        grade_year (int): user's grade year

    Returns:
        Union[str, None]: key of user attendance group or None
    """
    for group in grade_groups:
        if str(grade_year) in group:
            return group
    return None


def get_slot_distribution_as_dict(slot_dist_list):
    """
    Make a slot distribution on the form
    [{grade_group: "x,x,x", available_slots: 150}, {grade_group: "x,x", available_slots: 50}, ...]
    into a dictionary with grade_group as key and available slots as value
    """

    slot_distribution = {}
    for slot_dist_element in slot_dist_list:
        slot_distribution[slot_dist_element.grade_group] = slot_dist_element.available_slots

    return slot_distribution


def get_slot_distribution_as_list(slot_dist_dict):
    """
    Make a slot distribution that is a dictionary with grade_group as key and available slots as value
    into a list of objects on the form:
    [{grade_group: "x,x,x", available_slots: 150}, {grade_group: "x,x", available_slots: 50}, ...]
    """
    return [{"grade_group": grades, "available_slots": slots} for grades, slots in slot_dist_dict.items()]


def get_slot_distribution_as_list_in_camel_case(slot_dist_dict):
    """
    Make a slot distribution that is a dictionary with grade_group as key and available slots as value
    into a list of objects on the form:
    [{gradeGroup: "x,x,x", availableSlots: 150}, {gradeGroup: "x,x", availableSlots: 50}, ...]
    """
    return [{"gradeGroup": grades, "availableSlots": slots} for grades, slots in slot_dist_dict.items()]