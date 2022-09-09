from django.urls import path

from apps.ecommerce.views import VippsCallback
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("vipps/callback/v2/payments/<order_id>", csrf_exempt(VippsCallback.as_view())),
]
