from django.db import models
from enum import Enum
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .google_drive_api import get_url
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime


class FileType(models.TextChoices):
    BUD = ("Budsjett og Regnskap",)
    SUM = ("Generalforsamling",)
    YBO = ("Årbøker",)
    REG = ("Foreningens lover",)
    SUP = ("Støtte fra HS",)
    EXC = ("Utveksling",)
    OTH = ("Annet",)


class ArchiveDocument(models.Model):
    title = models.CharField(max_length=128)
    type_doc = models.CharField(
        max_length=20, choices=[(tag, tag.value) for tag in FileType]
    )
    file_location = models.CharField(max_length=2000, default=None, null=False)
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


@receiver(post_save, sender=ArchiveDocument)
def notify_doc(sender, instance, created, **kwargs):
    if created:
        instance.web_link = get_url(instance.file_location)
        instance.save()
