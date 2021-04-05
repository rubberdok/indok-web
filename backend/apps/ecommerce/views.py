from django.core.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response


from .models import Order
from .vipps_utils import capture_payment


class VippsCallback(APIView):
    def post(self, request, order_id):
        # Upon callback from Vipps, update status and attempt to capture payment

        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            raise ValueError("Ugyldig ordre")

        # Verify auth token
        if request.headers.get("Authorization", "") != order.auth_token:
            raise PermissionDenied("Unauthorized request")

        # Update payment status
        status = request.data.get("transactionInfo").get("status")
        if status == "RESERVED":
            if order.payment_status == Order.PaymentStatus.INITIATED:
                order.payment_status = Order.PaymentStatus.RESERVED
                order.save()
        elif status in ["RESERVE_FAILED", "SALE_FAILED", "CANCELLED"]:
            order.payment_status = Order.PaymentStatus.CANCELLED
            order.save()

        # Capture payment
        if order.payment_status == Order.PaymentStatus.RESERVED:
            try:
                capture_payment(order)
                order.payment_status = Order.PaymentStatus.CAPTURED
                order.save()
            except Exception as err:
                print(err)

        return Response()
