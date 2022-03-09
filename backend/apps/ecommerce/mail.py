from django.conf import settings
from utils.mail.streams import TemplateVariables, TransactionalEmail

from apps.users.models import User

from .models import Order


def send_order_confirmation_mail(order: Order) -> None:
    """
    Send an order confirmation upon capturing an order. The email is sent to the
    preferred email adress stored on the user that initiated the order.

    Args:
        order (Order): Order to send confirmation for
    """

    assert order.payment_status == Order.PaymentStatus.CAPTURED
    user: User = order.user

    receipt_details: list[TemplateVariables] = [
        {"description": order.product.description, "amount": f"{order.product.price} NOK"}
        for _ in range(order.quantity)
    ]
    template_variables: TemplateVariables = {
        user.email: {
            "product_url": f"{settings.BASE_URL}/ecommerce/fallback?orderId={order.id}",
            "product_name": order.product.name,
            "name": user.first_name,
            "receipt_id": str(order.id),
            "date": order.timestamp.strftime("%d.%m.%Y, %X"),
            "receipt_details": receipt_details,
            "total": f"{order.total_price} NOK",
            "support_mail": "kontakt@rubberdok.no",
            "action_url": f"{settings.BASE_URL}/ecommerce",
        }
    }

    email = TransactionalEmail(
        stream="order-confirmations",
        template_id="receipt",
        template_variables=template_variables,
        to=[order.user.email],
    )
    email.send()
