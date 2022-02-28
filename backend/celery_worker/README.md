# Celery

This module contains the logic related to launching celery worker, beat and flower.
In addition to this very simple guide you should read [here](https://betterprogramming.pub/python-celery-best-practices-ae182730bb81) to learn more about best practices when using Celery.

## How to create and run tasks

1. Create a file `tasks.py` in your app-folder. For example `backend/apps/ecommerce/tasks.py`.
2. Create a task by simply creating a function and using the `@shared_task`-decorator from Celery. Example:

```
@shared_task
def count_users():
    return User.objects.count()
```

3. To run the task simply do: `count_users.apply_async(queue="high_priority", priority=5)`

We currenty have 3 different types of queues: `default`, `high_priority` and `low_priority`.

## How to create periodic tasks

Periodic tasks can be created using either the Django admin panel or by creating new `PeriodicTask` objects directly from the code. Example of a `PeriodicTask` created in code:

```
schedule, _ = IntervalSchedule.objects.get_or_create(every=1, period=IntervalSchedule.MINUTES)
task = PeriodicTask.objects.create(
    name="Count users every minute",
    task="apps.ecommerce.tasks.count_users",
    interval=schedule,
    start_time=timezone.now(),
)
```

This task will run every minute until the `PeriodicTask` object is deleted. See [django-celery-beat](https://django-celery-beat.readthedocs.io/en/latest/) for more details.
