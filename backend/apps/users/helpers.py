from typing import TYPE_CHECKING, Literal
from django.utils import timezone
from django.core.exceptions import ValidationError


if TYPE_CHECKING:
    from apps.users.models import User


def update_graduation_year(user: "User", new_graduation_year: int) -> Literal[True]:
    updated_graduation_year = new_graduation_year != user.graduation_year

    if updated_graduation_year:
        # Check that graduation year is within the next five years
        # After August, current year should not be allowed, and a new year is allowed
        valid_year = True
        now = timezone.now()
        if now.month < 8:
            valid_year = new_graduation_year in range(now.year, now.year + 5)
        else:
            valid_year = new_graduation_year in range(now.year + 1, now.year + 6)
        if not valid_year:
            raise ValidationError(
                "Du må oppgi et gyldig avgangsår",
                params={"graduation_year": new_graduation_year},
            )

    elif updated_graduation_year and user.can_update_year:
        user.graduation_year = new_graduation_year
        if not user.first_login:
            user.year_updated_at = timezone.now()

    return True
