from graphql import GraphQLError
from django.utils import timezone
from apps.cabins.models import Booking as BookingModel

import re


def checkin_validation(check_in, check_out, cabin_ids):
    if check_in < timezone.now().date() or check_out < timezone.now().date():
        raise GraphQLError("Input dates are before current time")
    if check_in > check_out:
        raise GraphQLError("invalid input: Checkin is after checkout")
    # https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
    if BookingModel.objects.filter(
        check_in__lte=check_out,
        check_out__gt=check_in,
        cabins__id__in=cabin_ids,
    ).exists():
        raise GraphQLError("Input dates overlaps existing booking")


def email_validation(email):
    regex = r"^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$"
    if not re.search(regex, email):
        raise GraphQLError("Input email is invalid")


def name_validation(firstname, surname):
    if firstname == "" or surname == "":
        raise GraphQLError("Both first and last name must be non-empty strings")
