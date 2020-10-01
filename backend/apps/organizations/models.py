from django.db import models

# Create your models here.
class Organization(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100)
    description = models.CharField(max_length=4000, blank=True)

    parent = models.ForeignKey('Organization', on_delete=models.CASCADE, null=True)

    logo = models.ImageField(upload_to='organizations', null=True)

    def __str__(self):
        return f"{self.name}"
