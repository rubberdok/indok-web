from urllib.error import HTTPError

import graphene
from django.db import transaction
from graphql_jwt.decorators import login_required, staff_member_required

from apps.ecommerce.exceptions import PurchaseNotAllowedError
from apps.organizations.models import Organization
from apps.organizations.permissions import check_user_membership

from .models import Order, Product
from .types import OrderType, ProductType
from .vipps_utils import VippsApi


class InitiateOrder(graphene.Mutation):

    redirect = graphene.String()
    order_id = graphene.UUID()
    vipps_api = VippsApi()

    class Arguments:
        product_id = graphene.ID(required=True)
        quantity = graphene.Int()

    @login_required
    def mutate(self, info, product_id, quantity=1):
        user = info.context.user
        # Check if user is allowed to buy the product
        product = Product.objects.get(pk=product_id)
        if product.related_object and not product.related_object.is_user_allowed_to_buy_product(user):
            raise PurchaseNotAllowedError("Du kan ikke kjøpe dette produktet.")

        # Reserve quantity for the user if available
        product = Product.check_and_reserve_quantity(product_id, user, quantity)

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
                # Check order status at Vipps
                status, status_success = InitiateOrder.vipps_api.get_payment_status(
                    f"{order.id}-{order.payment_attempt}"
                )
                # If order canceled: retry, if reserved: stop attempt and restore quantity
                if status_success and status == "RESERVE":
                    """
                    NOTE: This logic enforces that if we have a order with status "reserved" in the DB,
                    we redirect the user in order to capture the order.
                    If the user wants to perform multiple orders, they currently have to sucessfully complete
                    one order before starting another. Should be changed when async worker is implemented.
                    """
                    order.payment_status = Order.PaymentStatus.RESERVED
                    order.save()
                    order.product.restore_quantity(order)
                    # Return order_id so frontend can redirect to fallback page
                    return InitiateOrder(order_id=order.id)

                # Retry
                order.payment_attempt = order.payment_attempt + 1
                order.payment_status = Order.PaymentStatus.INITIATED
                order.save()

        except Order.DoesNotExist:
            order = Order(product=product, user=user, quantity=quantity, total_price=product.price * quantity)

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
                order = Order.objects.select_for_update().get(pk=order_id, user=info.context.user)
            except Order.DoesNotExist:
                raise ValueError("Ugyldig ordre")

            if order.payment_status == Order.PaymentStatus.INITIATED:
                # Update status according to Vipps payment details
                status, status_success = AttemptCapturePayment.vipps_api.get_payment_status(
                    f"{order.id}-{order.payment_attempt}"
                )

                if status_success and status == "RESERVE":
                    order.payment_status = Order.PaymentStatus.RESERVED
                    order.save()
                elif status_success and status == "CANCEL":
                    order.payment_status = Order.PaymentStatus.CANCELLED
                    order.save()
                    # Order went from initiated to cancelled, restore quantity
                    order.product.restore_quantity(order)

            # Capture payent if it is reserved
            if order.payment_status == Order.PaymentStatus.RESERVED:
                try:
                    AttemptCapturePayment.vipps_api.capture_payment(order, method="polling")
                    order.payment_status = Order.PaymentStatus.CAPTURED
                    order.save()
                except HTTPError:
                    pass

        return AttemptCapturePayment(status=order.payment_status, order=order)


class CreateProductInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    description = graphene.String(required=True)
    price = graphene.Decimal(required=True)
    organization_id = graphene.ID(required=True)
    total_quantity = graphene.Int(required=True)
    max_buyable_quantity = graphene.Int(required=True)


class CreateProduct(graphene.Mutation):

    ok = graphene.Boolean()
    product = graphene.Field(ProductType)

    class Arguments:
        product_data = CreateProductInput(required=True)

    @staff_member_required
    def mutate(self, info, product_data):

        try:
            organization = Organization.objects.get(id=product_data.get("organization_id"))
        except Organization.DoesNotExist:
            raise ValueError("Ugyldig organisasjon oppgitt")

        check_user_membership(info.context.user, organization)

        product = Product()
        for k, v in product_data.items():
            setattr(product, k, v)
        product.save()
        ok = True

        return CreateProduct(product=product, ok=ok)
