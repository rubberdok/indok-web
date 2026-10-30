"""
Who opens the JanHus door for a booking is worked out by apps.arx from the booking's
fields (booker_user, organization_door_access, responsible_user, door_access_policy).
This module holds what the booking itself needs: finding the website user behind an
email address, and the warnings JanHus admins see when the booker will not get the door.
"""

from django.contrib.auth import get_user_model
from django.db.models import Count, Q

from apps.janhus.models import JanHusOrganizationDoorAccess
from apps.organizations.models import Membership
from apps.permissions.constants import HR_TYPE

LEADER_COUNT_ATTR = "active_leader_count"


def user_by_feide_email(email):
    """
    The one active website user whose Feide email is this address, or None. Only the
    Feide email counts: Feide verifies it, while anyone can type any profile email.
    """
    email = (email or "").strip()
    if not email:
        return None
    users = list(get_user_model().objects.filter(feide_email__iexact=email, is_active=True)[:2])
    return users[0] if len(users) == 1 else None


def with_leader_count(bookings):
    """Annotates each booking with its organisation's active leaders, for door_access_warnings, in the same query."""
    return bookings.annotate(
        **{
            LEADER_COUNT_ATTR: Count(
                "owner_organization__members",
                filter=Q(
                    owner_organization__members__group__group_type=HR_TYPE,
                    owner_organization__members__user__is_active=True,
                ),
                distinct=True,
            )
        }
    )


def _active_leader_count(booking) -> int:
    count = getattr(booking, LEADER_COUNT_ATTR, None)
    if count is None:
        count = Membership.objects.filter(
            organization_id=booking.owner_organization_id, group__group_type=HR_TYPE, user__is_active=True
        ).count()
    return count


def door_access_warnings(booking) -> list:
    """What a JanHus admin should know before confirming: the booker will not get the door."""
    if booking.is_external_booking:
        return [
            "Bestilleren er ikke en bruker på nettsiden og får ikke dørtilgang før det legges inn "
            "et eksternt kort for dem (Django admin, External card holders)."
        ]
    if booking.owner_organization_id:
        if booking.organization_door_access == JanHusOrganizationDoorAccess.BOOKER_ONLY:
            if not booking.booker_user_id:
                return ["Bestilleren er ikke koblet til en bruker på nettsiden, så ingen får dørtilgang som bestiller."]
            return []
        if _active_leader_count(booking) == 0:
            return [
                "Organisasjonen har ingen ledere på nettsiden, så ingen får dørtilgang som bestiller. "
                "Velg «Kun personen som bestilte», eller legg inn et eksternt kort."
            ]
        return []
    if not booking.owner_user_id:
        return ["Bookingen har ingen eier på nettsiden, så ingen får dørtilgang som bestiller."]
    return []
