from apps.organizations.models import Membership


JANUS_HYTTEFORENINGEN_SLUG = "janus-hyttene"


def can_manage_booking_access(user) -> bool:
    """
    Future-facing permission hook used for booking-driven NFC grants.
    Allows staff/superusers and members of Janus-hyttene.
    """
    if not user.is_authenticated:
        return False

    if user.is_staff or user.is_superuser:
        return True

    return Membership.objects.filter(user=user, organization__slug=JANUS_HYTTEFORENINGEN_SLUG).exists()
