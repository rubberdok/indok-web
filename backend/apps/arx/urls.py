from django.urls import path

from . import views

urlpatterns = [
    path("work", views.work, name="arx-runner-work"),
    path("results", views.results, name="arx-runner-results"),
    path("status", views.status, name="arx-runner-status"),
    path("event-cursor", views.event_cursor, name="arx-runner-event-cursor"),
    path("events", views.events, name="arx-runner-events"),
]
