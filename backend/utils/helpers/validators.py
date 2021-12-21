from django.core.exceptions import ValidationError


def email_validation(email: str):
    if email.count("@") != 1 or "." not in email.split("@")[-1]:
        raise ValidationError(f"Input email {email} is invalid")
