from django.db import models
from django.conf import settings

from apps.organizations.models import Organization


class Blog(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, related_name="blog")
    name = models.CharField(max_length=150)
    description = models.TextField()

    def __str__(self):
        return f"{self.name} (id: {self.id})"


class BlogPost(models.Model):

    title = models.CharField(max_length=150)
    text = models.TextField()
    publish_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, null=True, related_name="blog_post")

    def __str__(self):
        return f"{self.title} (id: {self.id})"
