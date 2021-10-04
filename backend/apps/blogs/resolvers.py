from .models import BlogPost as BlogPostModel


class BlogPostResolvers:
    def resolve_all_blog_posts(self, info):
        return BlogPostModel.objects.all()

    def resolve_blog_post_by_id(self, info, blog_post_id):
        try:
            return BlogPostModel.objects.get(pk=blog_post_id)
        except BlogPostModel.DoesNotExist:
            return None
