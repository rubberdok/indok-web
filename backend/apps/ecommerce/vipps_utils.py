import datetime
import json
from typing import Literal, Optional, Tuple, TypedDict, Union

import requests
from django.conf import settings
from django.utils import timezone

try:
    from sentry_sdk import set_context
except ModuleNotFoundError:

    def set_context(*args, **kwargs):
        pass


from .models import Order, VippsAccessToken

# Types
BaseHeaders = TypedDict(
    "BaseHeaders",
    {
        "Authorization": str,
        "Ocp-Apim-Subscription-Key": str,
        "Content-Type": str,
        "Merchant-Serial-Number": str,
        "Vipps-System-Name": str,
        "Vipps-System-Version": str,
        "X-Request-Id": str,
    },
    total=False,
)


class MerchantInfo(TypedDict, total=False):
    merchantSerialNumber: str
    callbackPrefix: str
    fallBack: str
    authToken: str
    isApp: bool


CustomerInfo = TypedDict("CustomerInfo", {"mobileNumber": str})


class TransactionInfo(TypedDict, total=False):
    orderId: str
    amount: int
    transactionText: str
    skipLandingPage: bool
    scope: str


InitiatePaymentBody = TypedDict(
    "InitiatePaymentBody",
    {
        "merchantInfo": MerchantInfo,
        "customerInfo": CustomerInfo,
        "transaction": TransactionInfo,
    },
)
CapturePaymentBody = TypedDict(
    "CapturePaymentBody",
    {
        "merchantInfo": MerchantInfo,
        "transaction": TransactionInfo,
    },
)


class CancelPaymentBody(TypedDict):
    merchantInfo: MerchantInfo
    transaction: TransactionInfo


class VippsApi:
    """
    API for handling Vipps payments.
    Class structure inspired by https://github.com/almazkun/vipps-python
    """

    def __init__(
        self,
        client_id: str = settings.VIPPS_CLIENT_ID,
        client_secret: str = settings.VIPPS_SECRET,
        vipps_subscription_key: str = settings.VIPPS_SUBSCRIPTION_KEY,
        merchant_serial_number: str = settings.VIPPS_MERCHANT_SERIAL_NUMBER,
        vipps_server: str = settings.VIPPS_BASE_URL,
        vipps_system_name: Optional[str] = None,
        vipps_system_version: Optional[str] = None,
        vipps_system_plugin_name: Optional[str] = None,
        vipps_system_plugin_version: Optional[str] = None,
    ):
        self.client_id = client_id
        self.client_secret = client_secret
        self.vipps_subscription_key = vipps_subscription_key
        self.merchant_serial_number = merchant_serial_number
        self.vipps_server = vipps_server
        self.vipps_system_name = vipps_system_name
        self.vipps_system_version = vipps_system_version
        self.vipps_system_plugin_name = vipps_system_plugin_name
        self.vipps_system_plugin_version = vipps_system_plugin_version

    def _make_call(
        self,
        method: Literal["POST", "GET", "PUT"],
        endpoint: str,
        headers: Union[BaseHeaders, dict[str, str]],
        data: Optional[str] = None,
    ) -> dict:
        """Used in main api calls
        Args:
            method (str): post, get or put
            endpoint (str): endpoint to make a call
            headers (dict): headers for a call
            data (dict, optional): body of the request. Defaults to None.
        Returns:
            dict: response body as a dict
        """
        if method == "GET":
            req = requests.get
        elif method == "POST":
            req = requests.post
        elif method == "PUT":
            req = requests.put

        url = f"{self.vipps_server}{endpoint}"

        r = req(url, headers=headers, data=data)

        try:
            r.raise_for_status()
            return r.json()
        except requests.exceptions.HTTPError as e:
            if isinstance(r.json(), list):
                set_context("vipps_error", r.json()[0])
            elif isinstance(r.json(), dict):
                set_context("vipps_error", r.json())
            raise e

    # Public methods:
    def capture_payment(self, order: Order, method: str) -> None:
        headers = self._build_headers()
        headers["X-Request-Id"] = str(order.id)
        capture_data = self._build_capture_payment_request(order, method)

        self._make_call(
            "POST",
            f"/ecomm/v2/payments/{order.id}-{order.payment_attempt}/capture",
            headers,
            json.dumps(capture_data),
        )

    def initiate_payment(self, order: Order, fallback_redirect: Optional[str] = None) -> str:
        headers = self._build_headers()
        order_data = self._build_initiate_payment_request(order, fallback_redirect)

        response = self._make_call("POST", "/ecomm/v2/payments", headers, json.dumps(order_data))
        return response["url"]

    def get_payment_status(self, order_id: str) -> Tuple[str, str]:
        headers = self._build_headers()

        response = self._make_call("GET", f"/ecomm/v2/payments/{order_id}/details", headers)

        history = response["transactionLogHistory"]
        return history[0]["operation"], history[0]["operationSuccess"]

    def cancel_transaction(self, order_id: str) -> dict:
        headers = self._build_headers()
        body: CancelPaymentBody = {
            "merchantInfo": {"merchantSerialNumber": self.merchant_serial_number},
            "transaction": {"transactionText": "Order cancelled by reattempt."},
        }
        data = self._make_call("PUT", f"/ecomm/v2/payments/{order_id}/cancel", headers, json.dumps(body))
        return data

    # private methods

    def _refresh_access_token(self) -> Tuple[str, datetime.datetime]:
        # Get new access token from Vipps (expires after 1h/24h test/prod)

        headers = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "Ocp-Apim-Subscription-Key": self.vipps_subscription_key,
        }

        token_response = self._make_call("POST", "/accessToken/get", headers)

        access_token = token_response["access_token"]
        expires_on = timezone.make_aware(datetime.datetime.fromtimestamp(int(token_response["expires_on"])))
        return access_token, expires_on

    @property
    def access_token(self) -> str:
        """Checks if access token already obtained
        Returns:
            str: Access Token
        """
        valid_token: Optional[VippsAccessToken] = VippsAccessToken.objects.filter(
            expires_on__gte=timezone.now() + timezone.timedelta(minutes=5)
        ).first()
        if valid_token is None:
            # No valid token in database, delete all stale tokens and get new token
            VippsAccessToken.objects.all().delete()
            token, expires_on = self._refresh_access_token()
            valid_token = VippsAccessToken(token=token, expires_on=expires_on)
            valid_token.save()

        return valid_token.token

    def _build_headers(self) -> BaseHeaders:
        # Headers for Vipps requests
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Ocp-Apim-Subscription-Key": self.vipps_subscription_key,
            "Content-Type": "application/json",
            "Merchant-Serial-Number": self.merchant_serial_number,
            "Vipps-System-Name": "indokntnu",
            "Vipps-System-Version": "1.0",
        }

    def _build_capture_payment_request(self, order: Order, method: str) -> CapturePaymentBody:
        return {
            "merchantInfo": {"merchantSerialNumber": self.merchant_serial_number},
            "transaction": {
                "amount": int(order.total_price * 100),
                "transactionText": f"Transaction captured from {method}",
            },
        }

    def _build_initiate_payment_request(self, order: Order, redirect: Optional[str] = None) -> InitiatePaymentBody:
        return {
            "merchantInfo": {
                "merchantSerialNumber": self.merchant_serial_number,
                "callbackPrefix": settings.VIPPS_CALLBACK_PREFIX,
                "fallBack": f"{settings.VIPPS_FALLBACK_PREFIX}?orderId={order.id}{f'&redirect={redirect}' if redirect else ''}",  # noqa
                "authToken": order.auth_token,
                "isApp": False,
            },
            "customerInfo": {"mobileNumber": str(order.user.phone_number)},
            "transaction": {
                "orderId": f"{order.id}-{order.payment_attempt}",
                "amount": int(order.total_price * 100),  # ører
                "transactionText": f"{order.quantity} {order.product.name}",
                "skipLandingPage": False,
                "scope": "name phoneNumber",
            },
        }
