from celery import shared_task
from apps.users.models import User


@shared_task
def count_users():
    return User.objects.count()


@shared_task
def add(x, y):
    z = x + y
    print("z: ", z)
