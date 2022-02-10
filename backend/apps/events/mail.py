from typing import Optional, Sequence
from django.core.mail import EmailMessage


def send_event_emails(receiver_emails: Sequence[str], content: Optional[str], subject: str) -> None:
    mail = EmailMessage(subject=subject, from_email="noreply@indokntnu.no", body=content, bcc=receiver_emails)
    mail.send()
