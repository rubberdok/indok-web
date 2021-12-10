import graphene

from .mutations import CreateBlog, DeleteBlog, UpdateBlog, CreateBlogPost, DeleteBlogPost, UpdateBlogPost
from .types import BlogType, BlogPostType
from .resolvers import BlogResolvers


class BlogMutations(graphene.ObjectType):
    create_blog = CreateBlog.Field()
    delete_blog = DeleteBlog.Field()
    update_blog = UpdateBlog.Field()
    create_blog_post = CreateBlogPost.Field()
    delete_blog_post = DeleteBlogPost.Field()
    update_blog_post = UpdateBlogPost.Field()


class BlogQueries(graphene.ObjectType, BlogResolvers):
    all_blogs = graphene.List(BlogType)
    blog = graphene.Field(BlogType, blog_id=graphene.ID(required=True))
    all_blog_posts = graphene.List(BlogPostType)
    blog_post = graphene.Field(BlogPostType, blog_post_id=graphene.ID(required=True))
