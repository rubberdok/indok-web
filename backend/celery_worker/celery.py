# noqa# noqa# noqa# noqa# noqa# noqa# noqa# noqa# noqa# noqa# noqafrom __future__ import absolute_import
from celery import Celery, shared_task
import os
import django

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")  # noqa
django.setup()  # noqa
# noqa# noqa# noqa# noqa
from apps.users.models import User  # noqa: E402
from django.conf import settings  # noqa

# noqa# noqa# noqa
app = Celery(
    "celery_worker", broker="amqp://user:password@rabbitmq:5672/", backend="rpc://"
)  # , include=["test_celery.tasks"]

app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.# noqa
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)  # noqa


@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")  # noqa# noqa# noqa


@shared_task
def count_users():  # noqa
    return User.objects.count()  # noqa# noqa# noqa


@shared_task
def edit_user(pk, new_first_name):
    user = User.objects.get(pk=pk)  # noqa# noqa# # noqa# noqanoqa
    user.first_name = new_first_name
    user.save()


# noqa# noqa# noqa# noqa# noqa# noqa# noqa# noqa# noqa
