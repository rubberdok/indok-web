from django.core.exceptions import PermissionDenied
from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .vipps_utils import VippsApi


class VippsCallback(APIView):

    vipps_api = VippsApi()

    @transaction.atomic
    def post(self, request, order_id):
        # Upon callback from Vipps, update status and attempt to capture payment

        # Remove payment_attempt to get internal order_id
        order_id = order_id.rpartition("-")[0]
        try:
            order = Order.objects.select_for_update().get(pk=order_id)
        except Order.DoesNotExist:
            raise ValueError("Ugyldig ordre")

        # Verify auth token
        if request.headers.get("Authorization", "") != order.auth_token:
            raise PermissionDenied("Unauthorized request")

        # Do nothing if transaction is already captured
        if order.payment_status == Order.PaymentStatus.CAPTURED:
            return Response()
        elif order.payment_status == Order.PaymentStatus.INITIATED:
            was_initiated = True

        # Update payment status
        status = request.data.get("transactionInfo").get("status")
        if status in Order.PaymentStatus.values:
            order.payment_status = status
        elif status in ["RESERVE_FAILED", "SALE_FAILED"]:
            order.payment_status = Order.PaymentStatus.FAILED
        order.save()

        # If order went from initiated to failed/cancelled, restore available quantity
        if (
            order.payment_status
            in [Order.PaymentStatus.FAILED, Order.PaymentStatus.CANCELLED, Order.PaymentStatus.REJECTED]
            and was_initiated
        ):
            order.product.restore_quantity(order)
            return Response()

        # Capture payment
        if order.payment_status == Order.PaymentStatus.RESERVED:
            try:
                VippsCallback.vipps_api.capture_payment(order, method="callback")
                order.payment_status = Order.PaymentStatus.CAPTURED
                order.save()
            except Exception as err:
                print(err)

        return Response()
