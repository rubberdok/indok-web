from django.urls import path

from .views import VippsCallback, InitiateOrder


urlpatterns = [
    path("order/", InitiateOrder.as_view()),
    path("callback/", VippsCallback.as_view()),
]
