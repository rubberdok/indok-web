from django.db import models
from django.conf import settings


class BlogPost(models.Model):

    title = models.CharField(max_length=150)
    text = models.TextField()
    publish_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.title} (id: {self.id})"
