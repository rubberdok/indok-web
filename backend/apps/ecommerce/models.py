import uuid

from django.conf import settings
from django.db import models, transaction
from django.db.models import F
from django.db.models.fields import DateTimeField

from apps.organizations.models import Organization

from ..users.models import User


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=11, decimal_places=2)
    description = models.TextField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="products")
    total_quantity = models.IntegerField()
    current_quantity = models.IntegerField(null=True)  # Set to total_quantity upon initialization
    max_buyable_quantity = models.IntegerField(default=1)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.current_quantity:
            self.current_quantity = self.total_quantity
        self.max_buyable_quantity = min(self.max_buyable_quantity, self.total_quantity)
        super().save(*args, **kwargs)

    @classmethod
    def check_and_reserve_quantity(cls, product_id, user: User, quantity: int):
        with transaction.atomic():
            # Check if the requested quantity is allowed
            try:
                # Acquire DB lock for the product (no other process can change it)
                product = cls.objects.select_for_update().get(pk=product_id)
            except cls.DoesNotExist:
                raise ValueError("Ugyldig produkt")

            captured_orders = Order.objects.filter(
                product__id=product_id,
                user=user,
                payment_status=Order.PaymentStatus.CAPTURED,
            )
            bought_quantity = sum([order.quantity for order in captured_orders])

            if bought_quantity >= product.max_buyable_quantity:
                raise ValueError("Du kan ikke kjøpe mer av dette produktet.")
            elif quantity + bought_quantity > product.max_buyable_quantity:
                raise ValueError("Forespurt antall enheter overskrider tillatt antall.")
            elif quantity > product.current_quantity:
                raise ValueError("Forespurt antall enheter overskrider tilgjengelige antall enheter.")

            # Update available quantity
            product.current_quantity = F("current_quantity") - quantity
            product.save()
            product.refresh_from_db()
        return product

    @classmethod
    def restore_quantity(cls, order: "Order"):
        assert order.payment_status in [
            Order.PaymentStatus.CANCELLED,
            Order.PaymentStatus.FAILED,
            Order.PaymentStatus.REJECTED,
        ]
        with transaction.atomic():
            # Acquire DB lock for the product (no other process can change it)
            product = cls.objects.select_for_update().get(pk=order.product.id)
            product.current_quantity = F("current_quantity") + order.quantity
            product.save()


def get_auth_token():
    return uuid.uuid4().hex


class Order(models.Model):
    class PaymentStatus(models.TextChoices):
        INITIATED = "INITIATED", "initiated"
        RESERVED = "RESERVED", "reserved"
        CAPTURED = "CAPTURED", "captured"
        CANCELLED = "CANCELLED", "cancelled"
        REFUNDED = "REFUNDED", "refunded"
        FAILED = "FAILED", "failed"
        REJECTED = "REJECTED", "rejected"

    order_id = models.CharField(primary_key=True, max_length=50)  # Used with Vipps
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="orders")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    quantity = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=11, decimal_places=2)
    payment_status = models.CharField(max_length=255, choices=PaymentStatus.choices, default=PaymentStatus.INITIATED)
    date = DateTimeField(auto_now_add=True)
    auth_token = models.CharField(max_length=32, default=get_auth_token)  # For authenticating Vipps callback
    payment_attempt = models.IntegerField(default=1)

    def __str__(self):
        return f"Order(product={self.product}, user={self.user})"


class VippsAccessToken(models.Model):
    """
    Stores access tokens from Vipps to use upon Vipps requests.

    """

    token = models.CharField(primary_key=True, max_length=2048)
    expires_on = DateTimeField()
