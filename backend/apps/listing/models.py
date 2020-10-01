from django.db import models
from apps.organizations.models import Organization
# Create your models here.

class Listing(models.Model):
    description = models.CharField(max_length=2000)
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=255, allow_unicode=True, default="")

    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()
    deadline = models.DateTimeField()

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)

    url = models.URLField()

    def __str__(self):
        return f"{self.title} (Open: {self.start_date_time} - {self.end_date_time}: {self.description}"

    def __repl__(self):
        return self.__str__()

