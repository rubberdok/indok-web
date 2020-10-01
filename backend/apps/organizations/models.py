from django.db import models

# Create your models here.
class Organization(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100)

    def __str__(self):
        return f"{self.name}"
