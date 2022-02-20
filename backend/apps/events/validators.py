from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.timezone import make_aware
from utils.helpers.validators import email_validation


def time_validation(start_time_input, end_time_input, start_time=None, end_time=None):
    # Make all date times aware (instead of naive)
    if start_time_input is not None and start_time_input.tzinfo is None:
        start_time_input = make_aware(start_time_input, is_dst=True)

    if start_time is not None and start_time.tzinfo is None:
        start_time = make_aware(start_time, is_dst=True)

    if end_time_input is not None and end_time_input.tzinfo is None:
        end_time_input = make_aware(end_time_input, is_dst=True)

    if end_time is not None and end_time.tzinfo is None:
        end_time = make_aware(end_time, is_dst=True)

    # Check that input date times are valid
    if (start_time_input is not None and start_time_input < timezone.now()) or (
        end_time_input is not None and end_time_input < timezone.now()
    ):
        raise ValidationError("Input datetimes are before current time")

    start_time_value = start_time
    if start_time_input is not None:
        start_time_value = start_time_input

    end_time_value = end_time
    if end_time_input is not None:
        end_time_value = end_time_input

    if start_time_value is not None and end_time_value is not None and start_time_value > end_time_value:
        raise ValidationError(
            "Invalid input: Start time must be before end time, and sign up open date must be before deadline"
        )


def title_and_desc_validation(title, description):
    if title == "" or description == "":
        raise ValidationError("Both title and description must be non-empty strings")


def price_binding_sign_up_validation(attendable_data, attendable=None):
    if attendable is not None:
        price = None
        if hasattr(attendable_data, "price") and attendable_data.price is not None:
            price = attendable_data.price

        elif hasattr(attendable, "price"):
            price = attendable.price

        binding_signup = attendable.binding_signup
        if hasattr(attendable_data, "binding_signup"):
            binding_signup = attendable_data.binding_signup

        if price is not None and not binding_signup:
            raise ValidationError("Betalt påmelding krever bindende påmelding")
    else:
        if (
            hasattr(attendable_data, "price")
            and attendable_data.price is not None
            and hasattr(attendable_data, "binding_signup")
            and not attendable_data.binding_signup
        ):
            raise ValidationError("Betalt påmelding krever bindende påmelding")


def slot_distribution_validation(total_allowed_grade_years, slot_distribution, total_available_slots):
    """
    Checks whether the grade groups in the slot distribution dict are the same as the
    allowed grade years in event.
    """

    allowed_grades = ""
    total_slots = 0
    for slot_dist_element in slot_distribution:
        allowed_grades += slot_dist_element.grade_group + ","
        total_slots += slot_dist_element.available_slots

    allowed_grades = allowed_grades[:-1]
    sorted_grades = sorted(allowed_grades)
    string_sorted_grades = "".join(sorted_grades).replace(",", "")

    if string_sorted_grades != "".join(str(grade) for grade in total_allowed_grade_years):
        raise ValidationError(
            "Trinnene arrangementet er åpent for stemmer ikke overens med plass fordelingen for trinn"
        )

    if total_slots < total_available_slots:
        raise ValidationError("Kan ikke ha færre plasser i plassfordelingen enn det er plasser på arrangementet")

    listed_total_grades_allowed: list[int] = [int(val) for val in allowed_grades.split(",")]
    if len(set(listed_total_grades_allowed)) != len(listed_total_grades_allowed):
        raise ValidationError("Samme trinn kan ikke være i flere 'Antall plasser'-kategorier")


def create_event_validation(event_data, attendable_data=None):
    end_time = None
    if event_data.end_time:
        end_time = event_data.end_time

    time_validation(start_time_input=event_data.start_time, end_time_input=end_time)
    title_and_desc_validation(event_data.title, event_data.description)

    if event_data.contact_email:
        email_validation(event_data.contact_email)

    if attendable_data is not None:
        time_validation(start_time_input=attendable_data.signup_open_date, end_time_input=event_data.start_time)
        if attendable_data.deadline:
            time_validation(start_time_input=attendable_data.signup_open_date, end_time_input=attendable_data.deadline)
            time_validation(start_time_input=attendable_data.deadline, end_time_input=event_data.start_time)

        price_binding_sign_up_validation(attendable_data)

        slot_distribution_validation(
            event_data.allowed_grade_years, attendable_data.slot_distribution, attendable_data.total_available_slots
        )


def update_event_validation(
    event,
    event_data,
    attendable=None,
    attendable_data=None,
):
    # Time validation, must check either input data or current values
    start_time_input = None
    if event_data.start_time:
        start_time_input = event_data.start_time

    end_time_input = None
    if event_data.end_time:
        end_time_input = event_data.end_time

    if start_time_input or end_time_input:
        start_time = event.start_time
        end_time = None
        if event.end_time:
            end_time = event.end_time

        time_validation(
            start_time_input=start_time_input, end_time_input=end_time_input, start_time=start_time, end_time=end_time
        )

    # Title, description and email validation
    if event_data.title or event_data.description:
        title_and_desc_validation(event_data.title, event_data.description)

    if event_data.contact_email:
        email_validation(event_data.contact_email)

    # Attendable validation
    if attendable_data is not None:  # There is new attendable data

        allowed_grade_years = [int(grade) for grade in event.allowed_grade_years_string.split(",")]
        if event_data.allowed_grade_years:
            allowed_grade_years = event_data.allowed_grade_years

        if attendable is None:  # There does not already exist an attendable object
            time_validation(
                start_time_input=attendable_data.signup_open_date,
                end_time_input=event_data.start_time,
                end_time=event.start_time,
            )
            if attendable_data.deadline:
                time_validation(
                    start_time_input=attendable_data.signup_open_date, end_time_input=attendable_data.deadline
                )
                time_validation(
                    start_time_input=attendable_data.deadline,
                    end_time_input=event_data.start_time,
                    end_time=event.start_time,
                )

            price_binding_sign_up_validation(attendable_data)

            slot_distribution_validation(
                allowed_grade_years, attendable_data.slot_distribution, attendable_data.total_available_slots
            )

        else:  # There already exists an attendable object

            if attendable_data.signup_open_date is not None or attendable_data.deadline is not None:
                signup_open_date = attendable.signup_open_date
                signup_open_date_input = None
                if (
                    attendable_data.signup_open_date
                    and make_aware(attendable_data.signup_open_date, is_dst=True) != signup_open_date
                ):
                    signup_open_date_input = attendable_data.signup_open_date

                deadline = None
                if attendable.deadline:
                    deadline = attendable.deadline

                deadline_input = None
                if attendable_data.deadline and make_aware(attendable_data.deadline, is_dst=True) != deadline:
                    deadline_input = attendable_data.deadline

                time_validation(
                    start_time_input=signup_open_date_input,
                    end_time_input=deadline_input,
                    start_time=signup_open_date,
                    end_time=deadline,
                )

            # Validate slot distribution fields
            slot_distribution = attendable.slot_distribution
            if attendable_data.slot_distribution:
                slot_distribution = attendable_data.slot_distribution

            total_available_slots = attendable.total_available_slots
            if attendable_data.slot_distribution:
                total_available_slots = attendable_data.total_available_slots

            slot_distribution_validation(allowed_grade_years, slot_distribution, total_available_slots)

            # Validate price and binding sign up
            if attendable_data.price is not None or attendable_data.binding_signup is not None:
                price_binding_sign_up_validation(attendable_data, attendable)
