import graphene
from graphene import NonNull

from .mutations import CreateBlogPost, DeleteBlogPost, UpdateBlogPost
from .types import BlogPostType
from .resolvers import BlogResolvers


class BlogMutations(graphene.ObjectType):
    create_blog_post = CreateBlogPost.Field()
    delete_blog_post = DeleteBlogPost.Field()
    update_blog_post = UpdateBlogPost.Field()


class BlogQueries(graphene.ObjectType, BlogResolvers):
    all_blog_posts = graphene.List(NonNull(BlogPostType))
    blog_post = graphene.Field(BlogPostType, blog_post_id=graphene.ID(required=True))
