import graphene
from django.shortcuts import get_object_or_404


from .models import BlogPost as BlogPostModel
from .types import BlogPostType
from graphql_jwt.decorators import permission_required


class CreateBlogPost(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        text = graphene.String()
        author_id = graphene.ID()

    ok = graphene.Boolean()
    blog_post = graphene.Field(BlogPostType)

    @permission_required("blogs.add_blogpost")
    def mutate(
        self,
        info,
        title,
        text,
        author_id,
    ):

        blog_post = BlogPostModel.objects.create(
            title=title,
            text=text,
            author_id=author_id,
        )

        return CreateBlogPost(blog_post=blog_post, ok=True)


class DeleteBlogPost(graphene.Mutation):
    class Arguments:
        blog_post_id = graphene.ID()

    ok = graphene.Boolean()

    @permission_required("blogs.delete_blogpost")
    def mutate(self, info, blog_post_id, **kwargs):
        try:
            blog_post = BlogPostModel.objects.get(pk=blog_post_id).delete()
        except BlogPostModel.DoesNotExist:
            return DeletePlogBost(ok=False)
        return DeleteBlogPost(ok=True)


class BlogPostInput(graphene.InputObjectType):
    title = graphene.String()
    text = graphene.String()


class UpdateBlogPostInput(BlogPostInput):
    id = graphene.ID(required=True)


class UpdateBlogPost(graphene.Mutation):
    class Arguments:
        blog_post_data = UpdateBlogPostInput()

    ok = graphene.Boolean()
    blog_post = graphene.Field(BlogPostType)

    @permission_required("blogs.change_blogpost")
    def mutate(
        self,
        info,
        blog_post_data,
    ):
        ok = True

        try:
            blog_post = BlogPostModel.objects.get(pk=blog_post_data.id)

            for input_field, input_value in blog_post_data.items():
                if input_field:
                    setattr(blog_post, input_field, input_value)
            blog_post.save()
            return UpdateBlogPost(blog_post=blog_post, ok=ok)

        except BlogPostModel.DoesNotExist:
            return UpdateBlogPost(
                blog_post=None,
                ok=False,
            )
