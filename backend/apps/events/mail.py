from datetime import datetime
from typing import Optional, Sequence, TypedDict

from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.template.loader import get_template
from django.utils.html import strip_tags

from apps.events.models import Event
from apps.users.models import User


class EmailInput(TypedDict):
    first_name: str
    last_name: str
    event_id: int
    event_title: str
    start_time: datetime


def send_event_emails(receiver_emails: Sequence[str], content: Optional[str], subject: str) -> None:
    mail = EmailMessage(subject=subject, from_email="noreply@indokntnu.no", body=content, bcc=receiver_emails)
    mail.send()


def send_waitlist_notification_email(user: User, event: Event) -> None:
    content: EmailInput = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "event_id": event.pk,
        "event_title": event.title,
        "start_time": event.start_time,
    }

    # HTML content for mail services supporting HTML, text content if HTML isn't supported
    html_content = get_template("events/order_confirmation.html").render(content)
    text_content = strip_tags(html_content)

    subject = f"[{event.title}] Du har fått plass på arrangementet"

    email = EmailMultiAlternatives(
        subject,
        body=text_content,
        from_email="noreply@indokntnu.no",
        to=user.email,
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
