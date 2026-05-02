from apps.organizations.models import Membership


JANUS_EIENDOM_FORENINGEN_SLUG = "janus-eiendom"


def can_manage_booking_access(user) -> bool:
    """
    Future-facing permission hook used for booking-driven NFC grants.
    Allows superusers and members of Janus-eiendom.
    """
    if not user.is_authenticated:
        return False

    if user.is_superuser:
        return True

    return Membership.objects.filter(
        user=user, organization__slug=JANUS_EIENDOM_FORENINGEN_SLUG
    ).exists()
