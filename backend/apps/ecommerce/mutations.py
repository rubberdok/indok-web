import random
import uuid

import graphene
from django.core.exceptions import PermissionDenied
from graphql_jwt.decorators import login_required

from ..organizations.models import Organization
from .models import Order, Product
from .types import ProductType
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

        # Check if the requested quantity is allowed
        captured_orders = Order.objects.filter(
            product__id=product_id,
            user=user,
            payment_status=Order.PaymentStatus.CAPTURED,
        )
        bought_quantity = sum([order.quantity for order in captured_orders])

        if bought_quantity >= product.max_buyable_quantity:
            raise ValueError("Du kan ikke kjøpe mer av dette produktet.")
        elif quantity + bought_quantity > product.max_buyable_quantity:
            raise ValueError("Forespurt antall enheter overskrider tillatt antall.")
        elif quantity > product.current_quantity:
            raise ValueError("Forespurt antall enheter overskrider tilgjengelige antall enheter.")

        # If the user has attempted this order before, retry it
        try:
            order = Order.objects.get(
                product__id=product_id,
                user=user,
                quantity=quantity,
                payment_status__in=[
                    Order.PaymentStatus.CANCELLED,
                    Order.PaymentStatus.REJECTED,
                    Order.PaymentStatus.FAILED,
                ],
            )
            order.payment_attempt = order.payment_attempt + 1
            order.payment_status = Order.PaymentStatus.INITIATED
            order.save()
        except Order.DoesNotExist:
            org_name = product.organization.slug[:13].replace(" ", "-")

            order_id = f"{org_name}-{uuid.uuid4().hex}"

            order = Order()
            order.order_id = order_id
            order.product = product
            order.user = user
            order.quantity = quantity
            order.total_price = product.price * quantity

            order.save()

        # Reserve the quantity upon successfull order initiation
        product.current_quantity = product.current_quantity - order.quantity
        product.save()

        redirect = InitiateOrder.vipps_api.initiate_payment(order)

        return InitiateOrder(redirect=redirect)


class AttemptCapturePayment(graphene.Mutation):
    # Polling request to capture payment in case callback does not succeed
    # Also returns payment status

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
            elif status_success and status == "CANCEL":
                order.payment_status = Order.PaymentStatus.CANCELLED
                order.save()
                # Order went from initiated to cancelled, restore quantity
                product = order.product
                product.current_quantity = product.current_quantity + order.quantity
                product.save()

        if order.payment_status == Order.PaymentStatus.RESERVED:
            try:
                AttemptCapturePayment.vipps_api.capture_payment(order, method="polling")
                order.payment_status = Order.PaymentStatus.CAPTURED
                order.save()
            except Exception as err:
                print(err)

        return AttemptCapturePayment(status=order.payment_status)


class CreateProduct(graphene.Mutation):

    ok = graphene.Boolean()
    product = graphene.Field(ProductType)

    def mutate(self, _):

        product = Product()
        product.name = "Atmos"
        product.price = str(random.randint(1, 10_000))
        product.description = "Best car."
        product.organization = Organization.objects.first()
        quantity = random.randint(1, 10)
        product.total_quantity = quantity
        product.max_buyable_quantity = random.randint(1, quantity)
        product.save()
        ok = True

        return CreateProduct(product=product, ok=ok)
