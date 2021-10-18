from django.db.models.signals import post_init, pre_save
from django.dispatch import receiver

from .models import Product


@receiver(post_init, sender=Product)
def set_initial_current_quantity(sender, instance: Product, **kwargs) -> None:
    instance.current_quantity = instance.total_quantity


@receiver(post_init, sender=Product)
def handle_max_buyable_quantity(sender, instance: Product, **kwargs) -> None:
    instance.max_buyable_quantity = min(instance.max_buyable_quantity, instance.total_quantity)
