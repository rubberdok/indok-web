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
