from enum import Enum
from graphene_django import DjangoObjectType
import graphene

from .models import Order, Product


class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
            "description",
            "max_buyable_quantity",
        ]


class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = [
            "id",
            "product",
            "user",
            "quantity",
            "total_price",
            "payment_status",
            "timestamp",
        ]

    @staticmethod
    def resolve_payment_status(parent: Order, info) -> str:
        if isinstance(parent.payment_status, Enum):
            return parent.payment_status.value
        return parent.payment_status


class OrdersByStatusType(graphene.ObjectType):
    orders = graphene.List(OrderType)
    length = graphene.Int()
