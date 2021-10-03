import graphene
from django.core.exceptions import PermissionDenied
from graphql_jwt.decorators import login_required

from .models import Order, Product
from .vipps_utils import VippsApi


class InitiateOrder(graphene.Mutation):

    redirect = graphene.String()
    vipps_api = VippsApi()

    class Arguments:
        product_id = graphene.ID(required=True)
        quantity = graphene.Int()

    @login_required
    def mutate(self, info, product_id, quantity=1):
        user = info.context.user

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            raise ValueError("Ugyldig produkt")

        # For now, only allow a single successfull purchase of a product
        if Order.objects.filter(
            product__id=product_id,
            user=user,
            payment_status=Order.PaymentStatus.CAPTURED,
        ).exists():
            raise Exception("Du har allerede kjøpt dette produktet.")

        # If the user has attempted this order before, retry it
        try:
            order = Order.objects.get(
                product__id=product_id,
                user=user,
                payment_status__in=[
                    Order.PaymentStatus.INITIATED,
                    Order.PaymentStatus.CANCELLED,
                    Order.PaymentStatus.REJECTED,
                    Order.PaymentStatus.FAILED,
                ],
            )
            order.payment_attempt = order.payment_attempt + 1
            order.save()
        except Order.DoesNotExist:
            # Note: we need to ensure the order id is unique for Vipps
            # below fails if orders are deleted
            counter = Order.objects.filter(
                product__organization=product.organization
            ).count()
            order_id = f"indok-{product.organization.name if len(product.organization.name) < 34 else product.organization.name[:34]}-{counter + 1}".replace(
                " ", "-"
            )

            order = Order()
            order.order_id = order_id
            order.product = product
            order.user = user
            order.quantity = quantity
            order.total_price = product.price * quantity
            order.save()

        redirect = InitiateOrder.vipps_api.initiate_payment(order)

        return InitiateOrder(redirect=redirect)


class AttemptCapturePayment(graphene.Mutation):
    # Polling request to capture payment in case callback does not succeed
    # Also returns payment status
    # TODO: see if /details endpoint can reveal FAILED / REJECTED / CANCELLED state

    status = graphene.String()
    vipps_api = VippsApi()

    class Arguments:
        order_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, order_id):
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            raise ValueError("Ugyldig ordre")

        if order.user != info.context.user:
            raise PermissionDenied("Du har ikke tilgang til denne ordren")

        if order.payment_status == Order.PaymentStatus.INITIATED:
            # Update status according to Vipps payment details
            status, status_success = AttemptCapturePayment.vipps_api.get_payment_status(
                f"{order.order_id}-{order.payment_attempt}"
            )

            if status_success and status == "RESERVE":
                order.payment_status = Order.PaymentStatus.RESERVED
                order.save()

        if order.payment_status == Order.PaymentStatus.RESERVED:
            try:
                AttemptCapturePayment.vipps_api.capture_payment(order, method="polling")
                order.payment_status = Order.PaymentStatus.CAPTURED
                order.save()
            except Exception as err:
                print(err)

        return AttemptCapturePayment(status=order.payment_status)
