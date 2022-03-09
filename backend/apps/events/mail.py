from typing import Optional, Sequence

from django.conf import settings
from utils.mail.streams import TransactionalEmail

from apps.ecommerce.models import Product
from apps.users.models import User

from .models import Event


class EventEmail:
    @staticmethod
    def send_event_emails(receiver_emails: Sequence[str], content: str, subject: str, event: Event) -> None:
        mail = TransactionalEmail(
            template_id="event-notifications",
            template_variables={},
            global_template_variables={
                "product_url": f"{settings.BASE_URL}/events/{event.pk}",
                "product_name": event.title,
                "body": f"Arrangøren av {event.title} har sendt følgende beskjed",
                "notification_body": content,
                "sender_name": event.organization.name,
                "sender_email": event.contact_email,
                "subject": subject,
            },
            stream="event-updates",
            to=receiver_emails,
        )
        mail.send()

    @staticmethod
    def send_waitlist_notification_email(user: User, event: Event) -> None:
        product: Optional[Product]
        try:
            product = event.products.get()
        except Product.DoesNotExist:
            product = None

        email = TransactionalEmail(
            stream="event-updates",
            template_id="event-notifications",
            template_variables={
                user.email: {
                    "product_url": f"{settings.BASE_URL}/events/{event.pk}",
                    "product_name": event.title,
                    "body": "Du har fått plass på følgende arrangement",
                    "start_time": event.start_time.strftime("%a %d. %b %X"),
                    "location": event.location,
                    "price": product.price if product is not None else "",
                    "reason": "Du har fått plass fra ventelisten.",
                    "subject": "Du har fått plass på arrangementet",
                }
            },
            to=[user.email],
        )
        email.send()
