from django.conf import settings
from django.db import models
from django.db.models.fields import DateTimeField

from apps.organizations.models import Organization


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=11, decimal_places=2)
    description = models.TextField()
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="products"
    )

    def __str__(self):
        return self.name


class Order(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ("initiated", "INITIATED"),
        ("reserved", "RESERVED"),
        ("captured", "CAPTURED"),
        ("cancelled", "CANCELLED"),
        ("refunded", "REFUNDED"),
    )

    order_id = models.CharField(primary_key=True, max_length=50)  # Used with Vipps
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="orders"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders"
    )
    quantity = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=11, decimal_places=2)
    payment_status = models.CharField(
        max_length=255, choices=PAYMENT_STATUS_CHOICES, default="initiated"
    )
    date = DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order(product={self.product}, user={self.user})"
