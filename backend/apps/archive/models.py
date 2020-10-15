from django.db import models
from enum import Enum
from datetime import datetime

# Create your models here.

class FileType(models.TextChoices):
    BUD = "Budget",
    ACC = "Accounting",
    SUM = "Summary",
    YBO = "Yearbook",
    GLI = "Guidelines",
    REG = "Regulation",
    STA = "Statues",
    OTH = "Others"

class ArchiveDocument(models.Model):
    title = models.CharField(max_length=128)
    date = models.DateField(default=None, blank=False, null=False)
    uploaded_date = datetime.now()
    type_doc = models.CharField(max_length=12,choices=[(tag, tag.value) for tag in FileType])
    description = models.TextField(default=None, blank=True, null=True) 
    file_location = models.CharField(max_length=100,default=None, null=False)


    def __str__(self):
        return self.title





