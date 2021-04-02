import json

import graphene
import requests
from django.conf import settings
from graphql_jwt.decorators import login_required

from .models import Order, Product

VIPPS_BASE_URL = "https://apitest.vipps.no"


class InitiateOrder(graphene.Mutation):

    redirect = graphene.String()

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

        counter = Order.objects.filter(product=product).count()
        order_id = f"indokntnu-{product.organization.name if len(product.organization.name) < 34 else product.organization.name[:34]}-{counter + 1}".replace(
            " ", "-"
        )

        order = Order()
        order.order_id = order_id
        order.product = product
        order.user = user
        order.quantity = quantity
        order.total_price = product.price * quantity
        order.save()

        access_token = get_access_token()

        headers, order_data = build_vipps_request(access_token, order)

        try:
            order_response = requests.post(
                f"{VIPPS_BASE_URL}/ecomm/v2/payments/",
                headers=headers,
                data=json.dumps(order_data),
            )
        except requests.exceptions.RequestException as err:
            print(f"Error initiating Vipps order: {err}")
            order.delete()
            raise Exception("En feil oppstod under initiering av Vipps-betalingen.")

        print(order_response.json())

        redirect = order_response.json()["url"]

        return InitiateOrder(redirect=redirect)


# TODO: Store globally and fetch periodically
def get_access_token():

    headers = {
        "client_id": settings.VIPPS_CLIENT_ID,
        "client_secret": settings.VIPPS_SECRET,
        "Ocp-Apim-Subscription-Key": settings.VIPPS_SUBSCRIPTION_KEY,
    }

    # Get access token (expires after 1h/24h test/prod)
    tokenResponse = requests.post(
        f"{VIPPS_BASE_URL}/accessToken/get",
        headers=headers,
    )

    access_token = tokenResponse.json()["access_token"]
    return access_token


def build_vipps_request(access_token, order):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Ocp-Apim-Subscription-Key": settings.VIPPS_SUBSCRIPTION_KEY,
        "Content-Type": "application/json",
    }

    order_data = {
        "merchantInfo": {
            "merchantSerialNumber": settings.VIPPS_MERCHANT_SERIAL_NUMBER,
            "callbackPrefix": "http://example.com/vipps/callback/",
            "fallBack": "http://127.0.0.1:3000/shop/fallback/",
            "authToken": order.auth_token,
            "isApp": False,
        },
        "customerInfo": {"mobileNumber": str(order.user.phone_number)},
        "transaction": {
            "orderId": order.order_id,
            "amount": int(order.total_price * 100),  # ører
            "transactionText": order.product.name,
            "skipLandingPage": False,
        },
    }
    return headers, order_data
