import graphene

from .models import BlogPost as BlogPostModel
from .types import BlogPostType

class CreateBlogPost(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        text = graphene.String()
        author_id = graphene.ID()

    ok = graphene.Boolean()
    blogPost = graphene.Field(BlogPostType)

    def mutate(self, info, title, text, author_id,):

        blogPost = BlogPostModel.objects.create(title=title, text=text, author_id=author_id,)

        ok = True
        return CreateBlogPost(blogPost=blogPost, ok=ok)



