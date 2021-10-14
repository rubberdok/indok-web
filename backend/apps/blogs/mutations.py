import graphene

from .models import BlogPost as BlogPostModel, Blog as BlogModel
from apps.organizations.models import Organization as OrganizationModel
from .types import BlogType, BlogPostType
from graphql_jwt.decorators import permission_required


class CreateBlog(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        description = graphene.String()
        organization_id = graphene.ID()

    ok = graphene.Boolean()
    blog = graphene.Field(BlogType)

    @permission_required("blogs.add_blog")
    def mutate(self, info, name, description, organization_id):
        
        try:
            organization = OrganizationModel.objects.get(pk=organization_id)
        
            blog = BlogModel.objects.create(
                name=name,
                description=description,
                organization=organization,
            )

            return CreateBlog(blog=blog, ok=True)
        except OrganizationModel.DoesNotExist:
            return CreateBlog(
                blog=None,
                ok=False,
            )

class DeleteBlog(graphene.Mutation):
    class Arguments:
        blog_id = graphene.ID()
    
    ok = graphene.ID()

    @permission_required("blogs.delete_blog")
    def mutate(self, info, blog_id, **kwargs):
        try:
            BlogModel.objects.get(pk=blog_id).delete()
        except BlogModel.DoesNotExist:
            return DeleteBlog(ok=False)
        return DeleteBlog(ok=True)


class BlogInput(graphene.InputObjectType):
    name = graphene.String()
    description = graphene.String()
    organization_id = graphene.ID()


class UpdateBlogInput(BlogInput):
    id = graphene.ID(required=True)


class UpdateBlog(graphene.Mutation):
    class Arguments:
        blog_data = UpdateBlogInput()

    ok = graphene.Boolean()
    blog = graphene.Field(BlogType)

    @permission_required("blogs.change_blog")
    def mutate(self, info, blog_data,):

        ok = True

        try:
            blog = BlogModel.objects.get(pk=blog_data.id)

            for input_field, input_value in blog_data.items():
                if input_value is not None:
                    setattr(blog, input_field, input_value)
            blog.save()

            return UpdateBlog(blog=blog, ok=ok)
        
        except BlogModel.DoesNotExist:
            return UpdateBlog(
                blog=None,
                ok=False,
            )


class CreateBlogPost(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        text = graphene.String()
        author_id = graphene.ID()
        blog_id = graphene.ID()

    ok = graphene.Boolean()
    blog_post = graphene.Field(BlogPostType)

    @permission_required("blogs.add_blogpost")
    def mutate(
        self,
        info,
        title,
        text,
        author_id,
        blog_id,
    ):

        try:
            blog = BlogModel.objects.get(pk=blog_id)

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
    blog_id = graphene.ID()


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
