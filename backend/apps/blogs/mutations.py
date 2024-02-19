import graphene

from .models import BlogPost as BlogPostModel
from apps.organizations.models import Organization as OrganizationModel
from .types import BlogPostType
from decorators import permission_required



class CreateBlogPost(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        text = graphene.String()
        author_id = graphene.ID()
        id = graphene.ID()

    ok = graphene.Boolean()
    blog_post = graphene.Field(BlogPostType)

    @permission_required("blogs.add_blogpost")
    def mutate(
        self,
        info,
        title,
        text,
        author_id,
        id,
    ):
        try:
            blog = BlogModel.objects.get(pk=id)

            blog_post = BlogPostModel.objects.create(
                title=title,
                text=text,
                author_id=author_id,
                blog=blog,
            )

            return CreateBlogPost(blog_post=blog_post, ok=True)
        except BlogModel.DoesNotExist:
            return CreateBlogPost(
                blog_post=None,
                ok=False,
            )


class DeleteBlogPost(graphene.Mutation):
    class Arguments:
        blog_post_id = graphene.ID()

    ok = graphene.Boolean()

    @permission_required("blogs.delete_blogpost")
    def mutate(self, info, blog_post_id, **kwargs):
        try:
            BlogPostModel.objects.get(pk=blog_post_id).delete()
        except BlogPostModel.DoesNotExist:
            return DeleteBlogPost(ok=False)
        return DeleteBlogPost(ok=True)


class BlogPostInput(graphene.InputObjectType):
    title = graphene.String()
    text = graphene.String()
    id = graphene.ID()


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
