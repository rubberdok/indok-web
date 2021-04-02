import graphene

from .mutations import InitiateOrder
from .resolvers import EcommerceResolvers
from .types import OrderType, ProductType


class EcommerceMutations(graphene.ObjectType):
    intiate_order = InitiateOrder.Field()


class EcommerceQueries(graphene.ObjectType, EcommerceResolvers):
    products = graphene.List(ProductType)
    user_orders = graphene.List(OrderType)
