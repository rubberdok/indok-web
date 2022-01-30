from typing import TypedDict

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.utils.html import strip_tags

from .models import Order


class EmailInput(TypedDict):
    first_name: str
    last_name: str
    order_id: str
    timestamp: str
    product: str
    quantity: int
    price: float


def send_order_confirmation_mail(order: Order) -> None:
    """
    Send an order confirmation upon capturing an order. The email is sent to the
    preferred email adress stored on the user that initiated the order.

    Args:
        order (Order): Order to send confirmation for
    """

    assert order.payment_status == Order.PaymentStatus.CAPTURED
    user = order.user

    content: EmailInput = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "order_id": order.id,
        "timestamp": order.timestamp.strftime("%d.%m.%Y, %H:%M:%S"),
        "product": order.product.name,
        "quantity": order.quantity,
        "price": order.total_price,
    }

    # HTML content for mail services supporting HTML, text content if HTML isn't supported
    html_content = get_template("ecommerce/order_confirmation.html").render(content)
    text_content = strip_tags(html_content)

    subject = f"Ordrebekreftelse - {order.product.name} - indokntnu.no"

    email = EmailMultiAlternatives(
        subject,
        body=text_content,
        from_email="noreply@indokntnu.no",
        to=[order.user.email],
    )
    email.mixed_subtype = "related"
    email.attach_alternative(html_content, "text/html")

    email.send()
