from celery import shared_task
from apps.users.models import User


@shared_task
def count_users():
    return User.objects.count()
