from datetime import date

from django.db import models
from django.db.models import QuerySet

"""
Helper method used in the app
"""


def number_of_nights(check_out: date, check_in: date) -> int:
    return (check_out - check_in).days


def is_internal_price(internal_participants: int, external_participants: int) -> bool:
    return internal_participants >= external_participants


def price(
    cabins: QuerySet, check_in: date, check_out: date, internal_participants: int, external_participants: int
) -> int:
    if is_internal_price(internal_participants, external_participants):
        price_pr_night = cabins.aggregate(models.Sum("internal_price"))["internal_price__sum"]
    else:
        price_pr_night = cabins.aggregate(models.Sum("external_price"))["external_price__sum"]
    return price_pr_night * number_of_nights(check_out, check_in)
