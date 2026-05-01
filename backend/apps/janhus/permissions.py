from __future__ import annotations

from typing import TYPE_CHECKING

from apps.permissions.constants import HR_TYPE

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractBaseUser


MANAGE_BOOKING_PERMISSION = "janhus.manage_booking"
MANAGE_SETTINGS_PERMISSION = "janhus.manage_settings"


def has_manage_booking_permission(user: AbstractBaseUser) -> bool:
    return bool(user and (user.is_superuser or user.has_perm(MANAGE_BOOKING_PERMISSION)))


def has_manage_settings_permission(user: AbstractBaseUser) -> bool:
    return bool(
        user
        and (
            user.is_superuser
            or user.has_perm(MANAGE_SETTINGS_PERMISSION)
            or user.has_perm(MANAGE_BOOKING_PERMISSION)
        )
    )


def normalize_phone_number(phone_number: str | None) -> str:
    if not phone_number:
        return ""

    digits_only = "".join(char for char in str(phone_number) if char.isdigit())

    if digits_only.startswith("0047"):
        return digits_only[4:]

    if digits_only.startswith("47") and len(digits_only) > 8:
        return digits_only[2:]

    return digits_only


def get_user_email_candidates(user: AbstractBaseUser) -> set[str]:
    return {
        (getattr(user, "email", "") or "").strip().lower(),
        (getattr(user, "feide_email", "") or "").strip().lower(),
    }


def _booking_contact_matches_user(booking_email: str, booking_phone: str, user: AbstractBaseUser) -> bool:
    user_emails = get_user_email_candidates(user)
    booking_email_lower = (booking_email or "").strip().lower()

    if booking_email_lower and booking_email_lower in user_emails:
        return True

    normalized_booking_phone = normalize_phone_number(booking_phone)
    normalized_user_phones = {
        normalize_phone_number(getattr(user, "phone_number", "")),
    }

    return bool(normalized_booking_phone and normalized_booking_phone in normalized_user_phones)


def is_booking_owner(user: AbstractBaseUser, booking) -> bool:
    if not user:
        return False

    if booking.owner_user_id and booking.owner_user_id == user.id:
        return True

    if booking.owner_organization_id:
        return booking.owner_organization.members.filter(
            user_id=user.id,
            group__group_type=HR_TYPE,
        ).exists()

    return False


def can_edit_guest_list(user: AbstractBaseUser, booking) -> bool:
    if not user:
        return False

    if has_manage_booking_permission(user):
        return True

    if is_booking_owner(user, booking):
        return True

    if _booking_contact_matches_user(booking.booker_email, booking.booker_phone, user):
        return True

    if _booking_contact_matches_user(booking.responsible_email, booking.responsible_phone, user):
        return True

    return False
