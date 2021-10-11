from django.contrib import admin
from apps.blogs.models import Blog, BlogPost

admin.site.register(BlogPost)
admin.site.register(Blog)

