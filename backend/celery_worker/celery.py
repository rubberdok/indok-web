from __future__ import absolute_import
from celery import Celery

# import os

# Set the default Django settings module for the 'celery' program.
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "celery_worker.settings")

app = Celery(
    "celery_worker", broker="amqp://user:password@rabbitmq:5672/"  # , backend="rpc://"
)  # , include=["test_celery.tasks"]

# app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
