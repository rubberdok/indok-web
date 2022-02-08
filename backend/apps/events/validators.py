from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.timezone import make_aware
from utils.helpers.validators import email_validation


ATTENDABLE_ERROR = "At a minimum, you must specify the number of available slots and when the sign up should open to create an attenable event"  # noqa


def time_validation(start_time, end_time):
    if start_time.tzinfo is None:
        start_time = make_aware(start_time, is_dst=True)

    if end_time is not None and end_time.tzinfo is None:
        end_time = make_aware(end_time, is_dst=True)

    if start_time < timezone.now() or (end_time is not None and end_time < timezone.now()):
        raise ValidationError("Input datetimes are before current time")

    if end_time is not None and start_time > end_time:
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


def create_event_validation(event_data, attendable_data=None, slot_distribution_data=None):

    end_time = None
    if event_data.end_time:
        end_time = event_data.end_time

    time_validation(event_data.start_time, end_time)
    title_and_desc_validation(event_data.title, event_data.description)

    if event_data.contact_email:
        email_validation(event_data.contact_email)

    if (attendable_data is not None and slot_distribution_data is None) or (
        attendable_data is None and slot_distribution_data is not None
    ):
        raise ValidationError(ATTENDABLE_ERROR)

    if attendable_data is not None:
        time_validation(attendable_data.signup_open_date, event_data.start_time)
        if attendable_data.deadline:
            time_validation(attendable_data.signup_open_date, attendable_data.deadline)
            time_validation(attendable_data.deadline, event_data.start_time)
        price_binding_sign_up_validation(attendable_data)


def update_event_validation(
    event,
    event_data,
    attendable=None,
    attendable_data=None,
    slot_distribution_data=None,
):
    start_time = event.start_time
    if event_data.start_time:
        start_time = event_data.start_time

    end_time = None
    if event_data.end_time:
        end_time = event_data.end_time
    elif event.end_time:
        end_time = event.end_time

    time_validation(start_time, end_time)

    if event_data.title or event_data.description:
        title_and_desc_validation(event_data.title, event_data.description)

    if event_data.contact_email:
        email_validation(event_data.contact_email)

    if attendable_data is not None and attendable is None and slot_distribution_data is None:
        raise ValidationError(ATTENDABLE_ERROR)

    if slot_distribution_data is not None and attendable is None and attendable_data is None:
        raise ValidationError(ATTENDABLE_ERROR)

    if attendable_data is not None:
        if attendable is not None:
            signup_open_date = attendable.signup_open_date
            if attendable_data.signup_open_date:
                signup_open_date = attendable_data.signup_open_date

            deadline = attendable.deadline
            if attendable_data.deadline:
                deadline = attendable_data.deadline

        else:
            signup_open_date = attendable_data.signup_open_date
            deadline = attendable_data.deadline

        if signup_open_date or deadline:
            time_validation(signup_open_date, deadline)

        if attendable_data.price or attendable_data.binding_signup is not None:
            price_binding_sign_up_validation(attendable_data, attendable)
