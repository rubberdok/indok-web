from apps.blogs.mutations import CreateBlogPost
import graphene

from .mutations import CreateBlogPost, DeleteBlogPost, UpdateBlogPost
from .types import BlogPostType
from .resolvers import BlogPostResolvers


class BlogPostMutations(graphene.ObjectType):
    create_blog_post = CreateBlogPost.Field()
    delete_blog_post = DeleteBlogPost.Field()
    update_blog_post = UpdateBlogPost.Field()


class BlogPostQueries(graphene.ObjectType, BlogPostResolvers):
    all_blog_posts = graphene.List(BlogPostType)
    blog_post = graphene.Field(BlogPostType, blog_post_id=graphene.ID(required=True))
