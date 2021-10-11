from graphene_django import DjangoObjectType

from .models import BlogPost as BlogPostModel, Blog as BlogModel


class BlogType(DjangoObjectType):
    class Meta:
        model = BlogModel
        

class BlogPostType(DjangoObjectType):
    class Meta:
        model = BlogPostModel
