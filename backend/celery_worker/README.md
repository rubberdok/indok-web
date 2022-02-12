# Celery

This module contains the logic related to launching celery worker, beat and flower.

## How to create tasks

1. Create a file `tasks.py` in your app-folder. For example `backend/apps/ecommerce/tasks.py`.
2. Create a task by simple creating a function and using the `@shared_task`-decorator from Celery. Example:

```
    @shared_task
    def count_users():
        return User.objects.count()
```

## How to create periodic tasks

Periodic tasks can be created using either the Django admin panel or by creating new PeriodicTask-objects directly from the code. Example of PeriodicTask created in code:

```
schedule, _ = IntervalSchedule.objects.get_or_create(every=1, period=IntervalSchedule.MINUTES)
task = PeriodicTask.objects.create(
    name="Count users",
    task="apps.ecommerce.tasks.count_users",
    interval=schedule,
    start_time=timezone.now(),
)
    task.save()
```

This task will run every minute until the PeriodicTask-object is deleted. See [django-celery-beat](https://django-celery-beat.readthedocs.io/en/latest/) for more details.
