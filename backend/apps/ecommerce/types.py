from graphene_django import DjangoObjectType
import graphene
from graphene import NonNull

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


# Graphene enum type extracted from Order model to allow reuse and consistent types for codegen
PaymentStatus = graphene.Enum.from_enum(Order.PaymentStatus)


class OrderType(DjangoObjectType):
    payment_status = PaymentStatus()

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


class OrdersByStatusType(graphene.ObjectType):
    orders = graphene.List(NonNull(OrderType))
    length = graphene.Int()
