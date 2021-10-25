import datetime
import json

import requests
from django.conf import settings
from django.utils import timezone

from .models import VippsAccessToken


class VippsApi:
    """
    API for handling Vipps payments.
    Class structure inspired by https://github.com/almazkun/vipps-python
    """

    VIPPS_BASE_URL = "https://apitest.vipps.no"

    def __init__(
        self,
        client_id: str = settings.VIPPS_CLIENT_ID,
        client_secret: str = settings.VIPPS_SECRET,
        vipps_subscription_key: str = settings.VIPPS_SUBSCRIPTION_KEY,
        merchant_serial_number: str = settings.VIPPS_MERCHANT_SERIAL_NUMBER,
        vipps_server: str = VIPPS_BASE_URL,
        access_token: str = None,
        vipps_system_name: str = None,
        vipps_system_version: str = None,
        vipps_system_plugin_name: str = None,
        vipps_system_plugin_version: str = None,
    ):
        self.client_id = client_id
        self.client_secret = client_secret
        self.vipps_subscription_key = vipps_subscription_key
        self.merchant_serial_number = merchant_serial_number
        self.vipps_server = vipps_server
        self._access_token = access_token
        self.vipps_system_name = vipps_system_name
        self.vipps_system_version = vipps_system_version
        self.vipps_system_plugin_name = vipps_system_plugin_name
        self.vipps_system_plugin_version = vipps_system_plugin_version

    def _make_call(self, method: str, endpoint: str, headers: dict, data=None) -> dict:
        """Used in main api calls
        Args:
            method (str): post, get or put
            endpoint (str): endpoint to make a call
            headers (dict): headers for a call
            data (dict, optional): body of the request. Defaults to None.
        Returns:
            dict: response body as a dict
        """

        if method == "get":
            req = requests.get
        elif method == "post":
            req = requests.post
        elif method == "put":
            req = requests.put

        url = f"{self.vipps_server}{endpoint}"

        print(f"VippsApi._make_call: making api call to the url: {url}")

        r = req(url, headers=headers, data=data)

        if r.ok:
            return r.json()

        r.raise_for_status()

    # Public methods:
    def capture_payment(self, order, method):
        headers = self.build_headers()
        headers["X-Request-Id"] = order.order_id[:-32]
        capture_data = self.build_capture_payment_request(order, method)

        self._make_call(
            "post",
            f"/ecomm/v2/payments/{order.order_id}-{order.payment_attempt}/capture",
            headers,
            json.dumps(capture_data),
        )

    def initiate_payment(self, order):
        headers = self.build_headers()
        order_data = self.build_initiate_payment_request(order)

        response = self._make_call("post", "/ecomm/v2/payments", headers, json.dumps(order_data))
        return response["url"]

    def get_payment_status(self, order_id):
        headers = self.build_headers()

        response = self._make_call("get", f"/ecomm/v2/payments/{order_id}/details", headers)

        history = response["transactionLogHistory"]
        return history[0]["operation"], history[0]["operationSuccess"]

    # private methods

    def _get_new_access_token(self):
        # Get access token (expires after 1h/24h test/prod)

        headers = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "Ocp-Apim-Subscription-Key": self.vipps_subscription_key,
        }

        token_response = self._make_call("post", "/accessToken/get", headers)

        access_token = token_response["access_token"]
        expires_on = timezone.make_aware(datetime.datetime.fromtimestamp(int(token_response["expires_on"])))
        return access_token, expires_on

    def _get_access_token(self):
        # Get Vipps access token from db or fetch new if necessary
        tokens = VippsAccessToken.objects
        if not tokens.filter(expires_on__gte=timezone.now()).exists():
            # No valid token in database, delete all stale tokens and get new token
            if tokens.exists():
                tokens.all().delete()
            new_token = VippsAccessToken()
            self._access_token, expires_on = self._get_new_access_token()
            new_token.token = self._access_token
            new_token.expires_on = expires_on
            new_token.save()

        self._access_token = tokens.filter(expires_on__gte=timezone.now()).first().token

    @property
    def access_token(self) -> str:
        """Checks if access token already obtained
        Returns:
            str: Access Token
        """
        if self._access_token is None:
            self._get_access_token()
        return self._access_token

    def build_headers(self):
        # Headers for Vipps requests
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Ocp-Apim-Subscription-Key": self.vipps_subscription_key,
            "Content-Type": "application/json",
            "Merchant-Serial-Number": self.merchant_serial_number,
            "Vipps-System-Name": "indokntnu",
            "Vipps-System-Version": "1.0",
        }

    def build_capture_payment_request(self, order, method):
        return {
            "merchantInfo": {"merchantSerialNumber": self.merchant_serial_number},
            "transaction": {
                "amount": int(order.total_price * 100),
                "transactionText": f"Transaction captured from {method}",
            },
        }

    def build_initiate_payment_request(self, order):
        return {
            "merchantInfo": {
                "merchantSerialNumber": self.merchant_serial_number,
                "callbackPrefix": "https://xoff0kv3i3.execute-api.eu-north-1.amazonaws.com/default/Vipps_callback",
                "fallBack": f"http://127.0.0.1:3000/shop/fallback/?orderId={order.order_id}",
                "authToken": order.auth_token,
                "isApp": False,
            },
            "customerInfo": {"mobileNumber": str(order.user.phone_number)},
            "transaction": {
                "orderId": f"{order.order_id}-{order.payment_attempt}",
                "amount": int(order.total_price * 100),  # ører
                "transactionText": f"{order.quantity} {order.product.name}",
                "skipLandingPage": False,
            },
        }
