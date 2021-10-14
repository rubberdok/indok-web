import graphene

from .mutations import AttemptCapturePayment, CreateProduct, InitiateOrder
from .resolvers import EcommerceResolvers
from .types import OrderType, ProductType


class EcommerceMutations(graphene.ObjectType):
    initiate_order = InitiateOrder.Field()
    attempt_capture_payment = AttemptCapturePayment.Field()
    create_product = CreateProduct.Field()


class EcommerceQueries(graphene.ObjectType, EcommerceResolvers):
    products = graphene.List(ProductType)
    order = graphene.Field(OrderType, order_id=graphene.ID(required=True))
    user_orders = graphene.List(OrderType)
