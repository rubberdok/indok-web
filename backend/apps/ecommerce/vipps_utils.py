import datetime
import json

import requests
from django.conf import settings
from django.utils import timezone

from .models import VippsAccessToken


class VippsApi:

    def __init__(
        self,
        client_id: str,
        client_secret: str,
        vipps_subscription_key: str,
        merchant_serial_number: str,
        vipps_server: str,
        callback_prefix: str,
        fall_back: str,
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
        self.callback_prefix = callback_prefix
        self.fall_back = fall_back
        self._access_token = access_token
        self.vipps_system_name = vipps_system_name
        self.vipps_system_version = vipps_system_version
        self.vipps_system_plugin_name = vipps_system_plugin_name
        self.vipps_system_plugin_version = vipps_system_plugin_version

    def _get_access_token():

VIPPS_BASE_URL = "https://apitest.vipps.no"

# TODO: Clean this code up by making a class, inspiration from https://github.com/almazkun/vipps-python


def get_access_token():
    # Get Vipps access token from db or fetch new if necessary
    tokens = VippsAccessToken.objects
    if not tokens.filter(expires_on__gte=timezone.now()).exists():
        # No valid token in database, delete all stale tokens and get new token
        if tokens.exists():
            tokens.all().delete()
        new_token = VippsAccessToken()
        access_token, expires_on = get_new_access_token()
        new_token.token = access_token
        new_token.expires_on = expires_on
        new_token.save()
        return access_token

    return tokens.filter(expires_on__gte=timezone.now()).first().token


def get_new_access_token():
    # Get access token (expires after 1h/24h test/prod)

    headers = {
        "client_id": settings.VIPPS_CLIENT_ID,
        "client_secret": settings.VIPPS_SECRET,
        "Ocp-Apim-Subscription-Key": settings.VIPPS_SUBSCRIPTION_KEY,
    }

    try:
        token_response = requests.post(
            f"{VIPPS_BASE_URL}/accessToken/get",
            headers=headers,
        ).json()
    except requests.exceptions.RequestException as err:
        print(f"Error retrieving Vipps access token: {err}")
        raise Exception("En feil oppstod under autentisering med Vipps.")

    access_token = token_response["access_token"]
    expires_on = timezone.make_aware(
        datetime.datetime.fromtimestamp(int(token_response["expires_on"]))
    )
    return access_token, expires_on


def build_headers():
    # Headers for Vipps requests
    access_token = get_access_token()

    return {
        "Authorization": f"Bearer {access_token}",
        "Ocp-Apim-Subscription-Key": settings.VIPPS_SUBSCRIPTION_KEY,
        "Content-Type": "application/json",
        "Merchant-Serial-Number": settings.VIPPS_MERCHANT_SERIAL_NUMBER,
        "Vipps-System-Name": "indokntnu",
        "Vipps-System-Version": "1.0",
    }


def build_initiate_payment_request(order):

    return {
        "merchantInfo": {
            "merchantSerialNumber": settings.VIPPS_MERCHANT_SERIAL_NUMBER,
            "callbackPrefix": "http://api.indokntnu.no/ecommerce/vipps/callback/",
            "fallBack": f"http://127.0.0.1:3000/shop/fallback/?orderId={order.order_id}",
            "authToken": order.auth_token,
            "isApp": False,
        },
        "customerInfo": {"mobileNumber": str(order.user.phone_number)},
        "transaction": {
            "orderId": f"{order.order_id}-{order.payment_attempt}",
            "amount": int(order.total_price * 100),  # ører
            "transactionText": f"{order.quantity}stk {order.product.name}",
            "skipLandingPage": False,
        },
    }


def initiate_payment(order):

    headers = build_headers()
    order_data = build_initiate_payment_request(order)

    try:
        response = requests.post(
            f"{VIPPS_BASE_URL}/ecomm/v2/payments/",
            headers=headers,
            data=json.dumps(order_data),
        )
        response.raise_for_status()
        redirect = response.json()["url"]

    except requests.exceptions.RequestException as err:
        print(f"Error initiating Vipps order: {err}")
        raise Exception("En feil oppstod under initiering av Vipps-betalingen.")
    return redirect


def get_payment_status(order_id):
    headers = build_headers()

    try:
        response = requests.get(
            f"{VIPPS_BASE_URL}/ecomm/v2/payments/{order_id}/details",
            headers=headers,
        )
        response.raise_for_status()
        details = response.json()
    except requests.exceptions.RequestException as err:
        print(f"Error retrieving Vipps details: {err}")
        raise Exception("En feil oppstod ved henting av betalingsdetaljer fra Vipps.")

    history = details["transactionLogHistory"]
    return history[0]["operation"], history[0]["operationSuccess"]


def build_capture_payment_request(order, method):
    return {
        "merchantInfo": {"merchantSerialNumber": settings.VIPPS_MERCHANT_SERIAL_NUMBER},
        "transaction": {
            "amount": int(order.total_price * 100),
            "transactionText": f"Transaction captured from {method}",
        },
    }


def capture_payment(order, method):
    headers = build_headers()
    headers["X-Request-Id"] = f"{order.order_id}-{order.payment_attempt}XIDC1"
    capture_data = build_capture_payment_request(order, method)

    try:
        capture_response = requests.post(
            f"{VIPPS_BASE_URL}/ecomm/v2/payments/{order.order_id}-{order.payment_attempt}/capture",
            headers=headers,
            data=json.dumps(capture_data),
        )
        capture_response.raise_for_status()

    except requests.exceptions.RequestException as err:
        print(f"Error capturing Vipps payment: {err}")
        raise Exception("En feil oppstod under Vipps-betaling.")
