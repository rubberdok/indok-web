from graphql_jwt.decoratos import login_required

from .models import Order, Product


class EcommerceResolvers:
    def resolve_products(self, info):
        return Product.objects.all()

    @login_required
    def resolve_user_orders(self, info):
        return Order.objects.get(user=info.context.user)
