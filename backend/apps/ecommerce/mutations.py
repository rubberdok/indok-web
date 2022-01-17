import random
import uuid

import graphene
from django.core.exceptions import PermissionDenied
from django.db import transaction
from faker import Faker
from graphql_jwt.decorators import login_required, staff_member_required


from apps.organizations.models import Organization
from .models import Order, Product
from .types import OrderType, ProductType
from .vipps_utils import VippsApi


class InitiateOrder(graphene.Mutation):

    redirect = graphene.String()
    order_id = graphene.String()
    vipps_api = VippsApi()

    class Arguments:
        product_id = graphene.ID(required=True)
        quantity = graphene.Int()

    @login_required
    def mutate(self, info, product_id, quantity=1):
        user = info.context.user

        product = Product.check_and_reserve_quantity(product_id, user, quantity)

        # Create or update the order
        # If the user has attempted this order before, retry it
        try:
            with transaction.atomic():
                # TODO: handle multiple hits (shouldn't happen as we retry)
                order = Order.objects.select_for_update().get(
                    product__id=product_id,
                    user=user,
                    quantity=quantity,
                    payment_status__in=[
                        Order.PaymentStatus.CANCELLED,
                        Order.PaymentStatus.REJECTED,
                        Order.PaymentStatus.FAILED,
                        Order.PaymentStatus.INITIATED,
                    ],
                )
                # Check order status at Vipps.
                status, status_success = InitiateOrder.vipps_api.get_payment_status(
                    f"{order.order_id}-{order.payment_attempt}"
                )
                # If order canceled: retry, if reserved: stop attempt and restore quantity
                if status_success and status == "RESERVE":
                    order.payment_status = Order.PaymentStatus.RESERVED
                    order.save()
                    order.product.restore_quantity(order)
                    return InitiateOrder(order_id=order.order_id)

                # Retry
                order.payment_attempt = order.payment_attempt + 1
                order.payment_status = Order.PaymentStatus.INITIATED
                order.save()

        except Order.DoesNotExist:
            org_name = product.organization.slug[:13].replace(" ", "-")

            order_id = f"{org_name}-{uuid.uuid4().hex}"

            order = Order(
                order_id=order_id,
                product=product,
                user=user,
                quantity=quantity,
                total_price=product.price * quantity
            )

            order.save()

        redirect = InitiateOrder.vipps_api.initiate_payment(order)

        return InitiateOrder(redirect=redirect)


class AttemptCapturePayment(graphene.Mutation):
    # Polling request to capture payment in case callback does not succeed
    # Also returns payment status

    status = graphene.String()
    order = graphene.Field(OrderType)
    vipps_api = VippsApi()

    class Arguments:
        order_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, order_id):
        with transaction.atomic():
            try:
                # Acquire DB lock for the order (no other process can change it)
                order = Order.objects.select_for_update().get(pk=order_id)
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
                    order.product.restore_quantity(order)

            if order.payment_status == Order.PaymentStatus.RESERVED:
                try:
                    AttemptCapturePayment.vipps_api.capture_payment(order, method="polling")
                    order.payment_status = Order.PaymentStatus.CAPTURED
                    order.save()
                except Exception as err:
                    print(err)

        return AttemptCapturePayment(status=order.payment_status, order=order)


class CreateProduct(graphene.Mutation):

    ok = graphene.Boolean()
    product = graphene.Field(ProductType)

    @staff_member_required
    def mutate(self, _):

        cars = ["Luna", "Nova", "Atmos", "Eld", "Gnist", "Vilje", "Arctos", "Aquilo", "Borealis"]

        product = Product()
        product.name = " ".join(Faker().words(2)).capitalize() + " " + cars[random.randint(0, len(cars) - 1)]
        product.price = str(random.randint(1, 10_000))
        product.description = "Best car." + f"\n{Faker().sentence()}"
        product.organization = Organization.objects.first()
        quantity = random.randint(1, 10)
        product.total_quantity = quantity
        product.max_buyable_quantity = random.randint(1, quantity)
        product.save()
        ok = True

        return CreateProduct(product=product, ok=ok)
