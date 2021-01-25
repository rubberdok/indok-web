from django.db import models
from enum import Enum
from datetime import datetime

# from quickstart import main as quickstart
# from django.db.models.signals import pre_save


# Create your models here.


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

    def __str__(self):
        return self.title