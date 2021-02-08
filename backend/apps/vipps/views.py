from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import requests
import json

from django.shortcuts import redirect


class VippsCallback(APIView):
    def post(self, request):
        print(request.json())


class InitiateOrder(APIView):
    def get(self, request):

        base_url = "https://apitest.vipps.no"

        headers = {
            "client_id": settings.VIPPS_CLIENT_ID,
            "client_secret": settings.VIPPS_SECRET,
            "Ocp-Apim-Subscription-Key": settings.VIPPS_SUBSCRIPTION_KEY,
        }

        # Get access token (expires after 1h/24h test/prod)
        tokenResponse = requests.post(
            f"{base_url}/accessToken/get",
            headers=headers,
        )

        access_token = tokenResponse.json()["access_token"]

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Ocp-Apim-Subscription-Key": settings.VIPPS_SUBSCRIPTION_KEY,
            "Content-Type": "application/json",
        }

        orderData = {
            "merchantInfo": {
                "merchantSerialNumber": settings.VIPPS_MERCHANT_SERIAL_NUMBER,
                "callbackPrefix": "http://example.com/vipps/callback/",
                "fallBack": "http://127.0.0.1:3000/shop/fallback/",
                "authToken": "a879dea4-3ed7-4f7a-8932-184ed58cbd88",
                "isApp": False,
            },
            "customerInfo": {
                "mobileNumber": "90942107"
            },  # Can pre-fill phone number here if we have
            "transaction": {
                "orderId": "111111-9",  # must increment automatically
                "amount": 1000,  # ører
                "transactionText": "Hello world",
                "skipLandingPage": False,
            },
        }

        orderResponse = requests.post(
            f"{base_url}/ecomm/v2/payments/",
            headers=headers,
            data=json.dumps(orderData),
        )
        redirect_to = orderResponse.json()["url"]

        return Response(data={"redirect": redirect_to})
