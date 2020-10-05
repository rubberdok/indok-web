from django.db import models

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=128)
    starttime = models.DateTimeField()
    description = models.TextField()

    def __str__(self):
        return self.title
