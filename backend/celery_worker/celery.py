from __future__ import absolute_import
from celery import Celery
import os
from django.conf import settings

print("Hello world")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

app = Celery(
    "celery_worker", broker=settings.CELERY_BROKER, backend=settings.CELERY_BACKEND, include=["celery_worker.tasks"],
)

app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


app.conf.beat_schedule = {
    "add-every-30-seconds": {"task": "tasks.add", "schedule": 30.0, "args": (16, 16)},
}
app.conf.timezone = "UTC"


""" @app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")  # noqa# noqa# noqa


@shared_task
def edit_user(pk, new_first_name):
    user = User.objects.get(pk=pk)  # noqa# noqa# # noqa# noqanoqa
    user.first_name = new_first_name
    user.save() """
