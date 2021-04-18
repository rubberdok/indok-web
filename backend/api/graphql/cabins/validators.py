from graphql import GraphQLError
from django.utils import timezone
from apps.cabins.models import Booking as BookingModel
from apps.cabins.models import Cabin as CabinModel
from django.db.models import Sum

import re


def create_booking_validation(booking_data):
    if booking_data.check_out and booking_data.check_in and booking_data.cabins:
        checkin_validation(
            booking_data.check_in,
            booking_data.check_out,
            booking_data.cabins,
        )
    if booking_data.receiver_email:
        email_validation(booking_data.receiver_email)
    if booking_data.firstname or booking_data.surname:
        name_validation(booking_data.firstname, booking_data.surname)
    if booking_data.phone:
        booking_data.phone = strip_phone_number(booking_data.phone)
        norwegian_phone_number_validation(booking_data.phone)
    if (
        booking_data.cabins
        and booking_data.internal_participants
        and booking_data.external_participants
    ):
        participants_validation(
            booking_data.internal_participants,
            booking_data.external_participants,
            booking_data.cabins,
        )


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
    if (check_out - check_in).days == 0:
        raise GraphQLError(
            "Invalid input: check-in and check-out cannot occur on the same day"
        )


def email_validation(email):
    regex = r"^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$"
    if not re.search(regex, email):
        raise GraphQLError("Input email is invalid")


def name_validation(firstname, surname):
    if firstname == "" or surname == "":
        raise GraphQLError("Both first and last name must be non-empty strings")


def norwegian_phone_number_validation(stripped_phone_number):
    error_message = "Invalid phone number. Has to be a norwegian phone number"
    # https://www.nkom.no/telefoni-og-telefonnummer/telefonnummer-og-den-norske-nummerplan/alle-nummerserier-for-norske-telefonnumre#8_og_12sifrede_nummer
    if len(stripped_phone_number) != 8:
        raise GraphQLError(error_message)
    if not (
        stripped_phone_number.startswith("4") or stripped_phone_number.startswith("9")
    ):
        raise GraphQLError(error_message)


def strip_phone_number(phone_number):
    cleaned_phone_number = phone_number.replace(" ", "")
    cleaned_phone_number = (
        cleaned_phone_number[3:]
        if cleaned_phone_number.startswith("+47")
        else cleaned_phone_number
    )
    return (
        cleaned_phone_number[4:]
        if cleaned_phone_number.startswith("0047")
        else cleaned_phone_number
    )


def participants_validation(number_of_internals, number_of_externals, cabins):
    if (number_of_internals + number_of_externals) > CabinModel.objects.filter(
        id__in=cabins
    ).aggregate(Sum("max_guests"))["max_guests__sum"]:
        raise GraphQLError(
            "There are more participants than there is capacity in the chosen cabins"
        )
