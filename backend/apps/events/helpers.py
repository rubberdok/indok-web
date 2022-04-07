from __future__ import annotations
from typing import TypedDict, Union
from datetime import datetime


class GradeDistributionData(TypedDict):
    grade_group: str
    available_slots: int


class AttendableData(TypedDict, total=False):
    signup_open_date: datetime
    binding_signup: bool
    deadline: datetime
    price: float


def get_attendant_group(grade_groups: list[str], grade_year: int) -> Union[str, None]:
    """
    Get the grade group that a grade_year is included in

    Args:
        grade_groups (list[str]): list of grades (string) e.g. ["1,2", "3", "4,5"]
        grade_year (int): user's grade year

    Returns:
        Union[str, None]: key of user attendance group or None
    """
    for group in grade_groups:
        if str(grade_year) in group:
            return group
    return None


def get_slot_distribution_as_dict(slot_dist_list: list[GradeDistributionData]) -> dict:
    """
    Make a slot distribution on the form
    [{grade_group: "x,x,x", available_slots: 150}, {grade_group: "x,x", available_slots: 50}, ...]
    into a dictionary with grade_group as key and available slots as value
    """
    slot_distribution = {}
    for slot_dist_element in slot_dist_list:
        slot_distribution[slot_dist_element.grade_group] = slot_dist_element.available_slots

    return slot_distribution


def get_slot_distribution_as_list(slot_dist_dict: dict) -> list[GradeDistributionData]:
    """
    Make a slot distribution that is a dictionary with grade_group as key and available slots as value
    into a list of objects on the form:
    [{grade_group: "x,x,x", available_slots: 150}, {grade_group: "x,x", available_slots: 50}, ...]
    """
    return [{"grade_group": grades, "available_slots": slots} for grades, slots in slot_dist_dict.items()]


def slot_distribution_is_updated(prev_slot_dist, new_slot_dist):
    """
    Check if slot distribution has been updated

    Args:
        prev_slot_dist (dict[grade_group:str, available_slots: int]): previous slot distribution
        new_slot_dist (dict[grade_group:str, available_slots: int]): new slot distribution

    Returns:
        bool: whether the slot distirbution has been updated (True) or not (False)
    """
    common_groups = list(set(prev_slot_dist.keys()).intersection(new_slot_dist.keys()))

    if len(prev_slot_dist) != len(common_groups):
        return True  # There has been an update in groups

    for group in prev_slot_dist.keys():
        if prev_slot_dist[group] != new_slot_dist[group]:
            return True  # There has been a change in the number of available slots for a grade group

    return False
