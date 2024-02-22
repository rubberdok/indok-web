from datetime import date, timedelta
from typing import TYPE_CHECKING, Union

from django.db import models
from django.db.models import QuerySet

if TYPE_CHECKING:
    from apps.booking.models import Cabin, Car

"""
Helper method used in the app
"""


def number_of_nights(check_out: date, check_in: date) -> int:
    return (check_out - check_in).days


def is_internal_price(internal_participants: int, external_participants: int) -> bool:
    return internal_participants >= external_participants


def get_weekday_nights(check_in: date, check_out: date) -> int:
    weekdays = 0
    for i in range(number_of_nights(check_out, check_in)):
        # Since i = 0, 1, ..., the date `d` will be `check_in`, `check_in + 1`, ..., `check_out - 1`
        d = check_in + timedelta(days=i)
        # 0 = Monday, 1=Tuesday, 2=Wednesday...
        # We count nights starting on Friday and Saturday as weekend, others as weekday nights
        # (nights starting on Sundays are also weekdays)
        if d.weekday() != 4 and d.weekday() != 5:
            weekdays += 1
    return weekdays


def price(
    product: Union[QuerySet["Cabin"], QuerySet["Car"]], check_in: date, check_out: date, internal_participants: int, external_participants: int
) -> int:
    if is_internal_price(internal_participants, external_participants):
        weekday_price_pr_night = product.aggregate(models.Sum("internal_price"))["internal_price__sum"]
        weekend_price_pr_night = product.aggregate(models.Sum("internal_price_weekend"))["internal_price_weekend__sum"]
    else:
        weekday_price_pr_night = product.aggregate(models.Sum("external_price"))["external_price__sum"]
        weekend_price_pr_night = product.aggregate(models.Sum("external_price_weekend"))["external_price_weekend__sum"]
    nights = number_of_nights(check_out, check_in)
    weekday_nights = get_weekday_nights(check_in, check_out)
    weekend_nights = nights - weekday_nights
    return weekday_nights * weekday_price_pr_night + weekend_nights * weekend_price_pr_night


def snake_case_to_camel_case(snake: str) -> str:
    first, *others = snake.split("_")
    return "".join([first.lower(), *map(str.title, others)])
