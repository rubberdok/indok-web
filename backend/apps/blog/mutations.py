
import graphene

from blog.models import *

class BlogPostInput(graphene.InputObjectType):
    title = graphene.String()
    author = graphene.String()
    date = graphene.Date()
    body = graphene.String()


class CreateBlogPost(graphene.Mutation):

    class Argument:
        post = BlogPostInput()

    def mutate(self, post):
        blogPost = BlogPost()
