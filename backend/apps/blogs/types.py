from graphene_django import DjangoObjectType

from .models import BlogPost as BlogPostModel, Blog as BlogModel


class BlogType(DjangoObjectType):
    class Meta:
        model = BlogModel
        fields = [
            "id",
            "description",
            "organization",
            "name",
        ]


class BlogPostType(DjangoObjectType):
    class Meta:
        model = BlogPostModel
        fields = [
            "id",
            "title",
            "text",
            "publish_date",
            "author",
            "blog",
        ]
