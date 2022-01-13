from django.core.exceptions import PermissionDenied
from graphql_jwt.decorators import login_required, staff_member_required

from .models import Order, Product


class EcommerceResolvers:
    @login_required
    def resolve_product(self, info, product_id):
        try:
            return Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return None

    @staff_member_required
    def resolve_products(self, info):
        return Product.objects.all()

    @login_required
    def resolve_order(self, info, order_id):
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            raise ValueError("Ugyldig ordre")

        if order.user != info.context.user:
            raise PermissionDenied("Du har ikke tilgang til denne ordren")

        return order

    @login_required
    def resolve_user_orders(self, info):
        return Order.objects.filter(user=info.context.user)
