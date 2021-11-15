from typing import Optional
from apps.blogs import models


class BlogResolvers:
    def resolve_all_blogs(self, info):
        return models.Blog.objects.all()

    def resolve_blog(self, info, blog_id):
        try:
            return models.Blog.objects.get(pk=blog_id)
        except models.Blog.DoesNotExist:
            return None

    def resolve_all_blog_posts(self, info):
        return models.BlogPost.objects.all()

    def resolve_blog_post(self, info, blog_post_id: int) -> Optional[models.BlogPost]:
        try:
            return models.BlogPost.objects.get(pk=blog_post_id)
        except models.BlogPost.DoesNotExist:
            return None
