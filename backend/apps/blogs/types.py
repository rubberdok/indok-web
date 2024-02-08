from graphene_django import DjangoObjectType

from .models import BlogPost as BlogPostModel

class BlogPostType(DjangoObjectType):
    class Meta:
        model = BlogPostModel
        fields = [
            "id",
            "title",
            "text",
            "publish_date",
            "author",
            "organization"
            
        ]
