from django.db import models
from datetime import datetime


class JanuscriptDocument(models.Model):
    title = models.CharField(max_length=128)
    thumbnail = models.CharField(max_length=2000, default=None, null=True)
    # file_location = models.CharField(max_length=2000, default=None, null=False)
    uploaded_date = datetime.now()
    year = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
    )
    web_link = models.CharField(
        max_length=2050,
        default=None,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title
