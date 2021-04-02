from django.urls import path

from .views import VippsCallback


urlpatterns = [
    path("callback/", VippsCallback.as_view()),
]
