import graphene

from .mutations import CreateBlog, CreateBlogPost, DeleteBlogPost, UpdateBlogPost
from .types import BlogPostType
from .resolvers import BlogPostResolvers


class BlogMutations(graphene.ObjectType):
    create_blog = CreateBlog.Field()
    create_blog_post = CreateBlogPost.Field()
    delete_blog_post = DeleteBlogPost.Field()
    update_blog_post = UpdateBlogPost.Field()


class BlogQueries(graphene.ObjectType, BlogPostResolvers):
    all_blog_posts = graphene.List(BlogPostType)
    blog_post = graphene.Field(BlogPostType, blog_post_id=graphene.ID(required=True))
