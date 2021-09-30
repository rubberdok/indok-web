from apps.blogs.mutations import CreateBlogPost
import graphene

from .mutations import CreateBlogPost
from .types import BlogPostType
from .resolvers import BlogPostResolvers

class BlogPostMutations(graphene.ObjectType):
    create_blogPost = CreateBlogPost.Field()

class BlogPostQueries(graphene.ObjectType, BlogPostResolvers):
    all_blog_posts = graphene.List(BlogPostType)
    blog_post = graphene.Field(BlogPostType, blog_post_id=graphene.ID(required=True))


