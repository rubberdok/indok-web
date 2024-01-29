import datetime
from typing import List
from graphql import GraphQLError
from django.utils import timezone
from apps.cars.models import CarBooking as CarBookingModel
from apps.cars.models import Car as CarModel
from django.db.models import Sum

from apps.cars.models import CarBookingSemester


def create_car_booking_validation(car_booking_data: CarBookingModel, car_booking_semester: CarBookingSemester):
    if car_booking_data.check_out and car_booking_data.check_in and car_booking_data.cars:
        checkin_validation(
            car_booking_data.check_in,
            car_booking_data.check_out,
            car_booking_data.cars,
        )
        car_booking_semester_validation(car_booking_data.check_in, car_booking_data.check_out, car_booking_semester)
    if car_booking_data.receiver_email:
        email_validation(car_booking_data.receiver_email)
    if car_booking_data.first_name or car_booking_data.last_name:
        name_validation(car_booking_data.first_name, car_booking_data.last_name)
    if car_booking_data.phone:
        car_booking_data.phone = strip_phone_number(car_booking_data.phone)
        norwegian_phone_number_validation(car_booking_data.phone)
    if car_booking_data.cars and car_booking_data.internal_participants and car_booking_data.external_participants:
        participants_validation(
            car_booking_data.internal_participants,
            car_booking_data.external_participants,
            car_booking_data.cars,
        )


def car_booking_semester_validation(
    check_in: datetime.date, check_out: datetime.date, car_booking_semester: CarBookingSemester
) -> None:
    dates_in_fall_semester = check_dates_in_range(
        [check_in, check_out], car_booking_semester.fall_start_date, car_booking_semester.fall_end_date
    )
    dates_in_spring_semester = check_dates_in_range(
        [check_in, check_out], car_booking_semester.spring_start_date, car_booking_semester.spring_end_date
    )
    not_in_any_car_booking_semester = not dates_in_spring_semester and not dates_in_fall_semester

    if not car_booking_semester.fall_semester_active and not car_booking_semester.spring_end_date:
        raise GraphQLError("None of the car_booking semesters are active.")

    elif (
        not_in_any_car_booking_semester
        or dates_in_fall_semester
        and not car_booking_semester.fall_semester_active
        or dates_in_spring_semester
        and not car_booking_semester.spring_semester_active
    ):
        raise GraphQLError("Dates are outside of the car_booking semesters.")


def check_dates_in_range(dates: List[datetime.date], range_start: datetime.date, range_end: datetime.date) -> bool:
    return range_start <= dates[0] and dates[-1] <= range_end


def checkin_validation(check_in, check_out, car_ids):
    if check_in < timezone.now().date() or check_out < timezone.now().date():
        raise GraphQLError("Input dates are before current time")
    if check_in > check_out:
        raise GraphQLError("invalid input: Checkin is after checkout")
    # https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
    if CarBookingModel.objects.filter(
        check_in__lte=check_out, check_out__gt=check_in, cars__id__in=car_ids, is_declined=False
    ).exists():
        raise GraphQLError("Input dates overlaps existing car_booking")
    if (check_out - check_in).days == 0:
        raise GraphQLError("Invalid input: check-in and check-out cannot occur on the same day")


def email_validation(email: str):
    if email.count("@") != 1 or "." not in email.split("@")[-1]:
        raise GraphQLError(f"Input email {email} is invalid")


def name_validation(first_name, last_name):
    if first_name == "" or last_name == "":
        raise GraphQLError("Both first and last name must be non-empty strings")


def norwegian_phone_number_validation(stripped_phone_number: str):
    error_message = "Invalid phone number. Has to be a norwegian phone number"
    # https://www.nkom.no/telefoni-og-telefonnummer/telefonnummer-og-den-norske-nummerplan/alle-nummerserier-for-norske-telefonnumre#8_og_12sifrede_nummer
    if len(stripped_phone_number) != 8 and not stripped_phone_number.isdigit():
        raise GraphQLError(error_message)
    if not (stripped_phone_number.startswith("4") or stripped_phone_number.startswith("9")):
        raise GraphQLError(error_message)


def strip_phone_number(phone_number):
    # Remove spacing
    cleaned_phone_number = phone_number.replace(" ", "")
    # Remove country code
    cleaned_phone_number = cleaned_phone_number[3:] if cleaned_phone_number.startswith("+47") else cleaned_phone_number
    # Remove country code
    return cleaned_phone_number[4:] if cleaned_phone_number.startswith("0047") else cleaned_phone_number


def participants_validation(number_of_internals: int, number_of_externals: int, cars):
    if (number_of_internals + number_of_externals) > CarModel.objects.filter(id__in=cars).aggregate(
        Sum("max_guests")
    )["max_guests__sum"]:
        raise GraphQLError("There are more participants than there is capacity in the chosen cars")
