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


class OrdersByStatusType(graphene.ObjectType):
    orders = graphene.List(OrderType)
    length = graphene.Int()
