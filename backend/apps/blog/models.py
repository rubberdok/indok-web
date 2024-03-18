from django.db import models

# Create your models here.

class BlogPost(models.Model):

    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    date = models.DateField()
    body = models.TextField()
    # image = models.ImageField()  ?

    def __str__(self):
        return self.title
