from django.db import models
from enum import Enum
from datetime import datetime
from quickstart import main as quickstart
#from django.db.models.signals import pre_save


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
    uploadedDate = datetime.now()
    typeDoc = models.CharField(max_length=12,choices=[(tag, tag.value) for tag in FileType])
    description = models.TextField(default=None, blank=True, null=True) 
    fileLocation = models.CharField(max_length=100,default=None, null=False)
    #thumbnailLink = quickstart(fileLocation)

    def __str__(self):
        return self.title

#def setThumbnailLink(sender, instance, *args, **kvargs):
   # link = ArchiveDocument.ocke




