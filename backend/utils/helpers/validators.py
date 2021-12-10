from django.core.exceptions import ValidationError


def email_validation(email: str):
    if not email.count("@") == 1 and "." not in email.split("@")[-1]:
        raise ValidationError(f"Input email {email} is invalid")











