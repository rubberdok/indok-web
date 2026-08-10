from collections.abc import Iterable

from django.conf import settings
from django.core.mail import send_mail

from apps.janhus.models import JanHusBooking


def send_pending_review_notification(bookings: Iterable[JanHusBooking]) -> None:
    recipients_by_key: dict[str, str] = {}
    for booking in bookings:
        for email in [booking.responsible_email, booking.booker_email]:
            clean_email = (email or "").strip()
            if clean_email:
                recipients_by_key[clean_email.lower()] = clean_email

    recipients = list(recipients_by_key.values())

    if not recipients:
        return

    send_mail(
        subject="JanHus booking set to pending admin review",
        message=(
            "A booking in your selected timeframe has been moved to pending admin review. "
            "A JanHus booking admin will follow up shortly."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=list(recipients),
        fail_silently=True,
    )
