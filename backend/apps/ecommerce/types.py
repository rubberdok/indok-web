from graphene_django import DjangoObjectType

from .models import Order, Product


class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = [
            "name",
            "price",
            "description",
        ]


class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = [
            "order_id",
            "product",
            "user",
            "quantity",
            "total_price",
            "payment_status",
            "date",
        ]
