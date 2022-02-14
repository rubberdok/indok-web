from apps.ecommerce.models import Order
from celery import shared_task


@shared_task
def count_orders():
    return Order.objects.count()
