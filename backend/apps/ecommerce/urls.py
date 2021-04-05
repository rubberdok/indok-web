from django.urls import path

from .views import VippsCallback


urlpatterns = [
    path("vipps/callback/v2/payments/<order_id>", VippsCallback.as_view()),
]
