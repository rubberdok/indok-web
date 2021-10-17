from graphql import GraphQLError
from django.utils import timezone


def time_validation(start_time, end_time):
    if start_time < timezone.now() or end_time is not None and end_time < timezone.now():
        raise GraphQLError("Input datetimes are before current time")

    if end_time is not None and start_time > end_time:
        raise GraphQLError(
            "Invalid input: Start time must be before end time, and sign up open date must be before deadline"
        )


def email_validation(email: str):
    if not (email.count("@") == 1 and "." in email.split("@")[-1]):
        raise GraphQLError(f"Input email {email} is invalid")


def title_and_desc_validation(title, description):
    if title == "" or description == "":
        raise GraphQLError("Both title and description must be non-empty strings")


def price_binding_sign_up_validation(attendable_data, attendable=None):
    if attendable is not None:
        price = (
            attendable_data.price
            if hasattr(attendable_data, "price") and attendable_data.price is not None
            else attendable.price
            if hasattr(attendable, "price")
            else None
        )
        binding_signup = (
            attendable_data.binding_signup if hasattr(attendable_data, "binding_signup") else attendable.binding_signup
        )
        if price is not None and binding_signup == False:
            raise GraphQLError("Betalt påmelding krever bindende påmelding")
    else:
        if (
            hasattr(attendable_data, "price")
            and attendable_data.price is not None
            and hasattr(attendable_data, "binding_signup")
            and attendable_data.binding_signup == False
        ):
            raise GraphQLError("Betalt påmelding krever bindende påmelding")


def create_event_validation(event_data, attendable_data=None, slot_distribution_data=None):
    time_validation(event_data.start_time, event_data.end_time if event_data.end_time else None)
    title_and_desc_validation(event_data.title, event_data.description)

    if event_data.contact_email:
        email_validation(event_data.contact_email)

    if (attendable_data is not None and slot_distribution_data is None) or (
        attendable_data is None and slot_distribution_data is not None
    ):
        raise GraphQLError(
            "At a minimum, you must specify the number of available slots and when the sign up should open to create an attenable event"
        )

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
    time_validation(
        event_data.start_time if event_data.start_time else event.start_time,
        event_data.end_time if event_data.end_time else event.end_time if event.end_time else None,
    )
    if event_data.title or event_data.description:
        title_and_desc_validation(event_data.title, event_data.description)

    if event_data.contact_email:
        email_validation(event_data.contact_email)

    if attendable_data is not None and attendable is None and slot_distribution_data is None:
        raise GraphQLError(
            "At a minimum, you must specify the number of available slots and when the sign up should open to create an attenable event"
        )

    if slot_distribution_data is not None and attendable is None and attendable_data is None:
        raise GraphQLError(
            "At a minimum, you must specify the number of available slots and when the sign up should open to create an attenable event"
        )

    if attendable_data is not None:
        if attendable is not None:
            signup_open_date = (
                attendable_data.signup_open_date if attendable.signup_open_date else attendable.signup_open_date
            )
            deadline = attendable_data.deadline if attendable.deadline else attendable.deadline
        else:
            signup_open_date = attendable_data.signup_open_date
            deadline = attendable_data.deadline

        if signup_open_date or deadline:
            time_validation(signup_open_date, deadline)

        if attendable_data.price or attendable_data.binding_signup is not None:
            price_binding_sign_up_validation(attendable_data, attendable)