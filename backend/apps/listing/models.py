from django.db import models
import uuid
# Create your models here.

class Listing(models.Model):
    description = models.CharField(max_length=2000)
    title = models.CharField(max_length=100)

    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()

    url = models.URLField()
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    def __str__(self):
        return f"{self.title} (Open: {self.start_date_time} - {self.end_date_time}: {self.description}"

    def __repl__(self):
        return self.__str__()
