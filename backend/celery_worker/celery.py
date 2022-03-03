from __future__ import absolute_import
from celery import Celery
import os
from django.conf import settings

# Set default sets the DJANGO_SETTINGS_MODULE only if it hasn't been set already so this will only affect production.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

app = Celery(
    "celery_worker",
    broker=f"amqp://{settings.RABBITMQ_DEFAULT_USER}:{settings.RABBITMQ_DEFAULT_PASS}@{settings.CELERY_BROKER}",
    backend=settings.CELERY_BACKEND,
)

app.config_from_object("django.conf:settings", namespace="CELERY")  # Read all settings related to Celery.

# Load task modules from all registered Django apps.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

app.conf.timezone = "UTC"
