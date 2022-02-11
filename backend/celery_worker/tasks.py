from celery import shared_task
from apps.users.models import User
from django_celery_beat.models import IntervalSchedule, PeriodicTask
from django.utils import timezone


@shared_task
def count_users():
    return User.objects.count()


@shared_task
def create_periodic_task():
    schedule, _ = IntervalSchedule.objects.get_or_create(every=1, period=IntervalSchedule.MINUTES)
    task = PeriodicTask.objects.create(
        name="Count users", task="celery_worker.tasks.count_users", interval=schedule, start_time=timezone.now(),
    )
    task.save()
