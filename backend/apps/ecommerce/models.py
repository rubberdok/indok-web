import uuid

from django.conf import settings
from django.db import models
from django.db.models.fields import DateTimeField

from apps.organizations.models import Organization
from apps.events.models import Event, SignUp


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=11, decimal_places=2)
    description = models.TextField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="products")
    event = models.OneToOneField(Event, null=True, blank=True)

    def __str__(self):
        return self.name


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
    sign_up = models.OneToOneField(SignUp, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Order(product={self.product}, user={self.user})"


class VippsAccessToken(models.Model):
    """
    Stores access tokens from Vipps to use upon Vipps requests.

    """

    token = models.CharField(primary_key=True, max_length=2048)
    expires_on = DateTimeField()
