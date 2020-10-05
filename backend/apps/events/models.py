from django.contrib.auth import get_user_model
from django.db import models


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=64)


class Event(models.Model):
    title = models.CharField(max_length=128)
    starttime = models.DateTimeField()
    endtime = models.DateTimeField(blank=True)
    location = models.TextField()
    description = models.TextField()
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING)
    image = models.URLField(blank=True)
    is_attendable = models.BooleanField()
    deadline = models.DateTimeField()
    publisher = models.TextField()

    # TODO: Integrate when models are finished
    # author = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.title
