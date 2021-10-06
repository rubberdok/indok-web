from typing import Optional
from apps.blogs import models


class BlogPostResolvers:
    def resolve_all_blog_posts(self, info):
        return models.BlogPost.objects.all()
    def resolve_blog_post_by_id(self, info, blog_post_id: int) -> Optional[models.BlogPost]:
        try:
            return models.BlogPost.objects.get(pk=blog_post_id)
        except models.BlogPost.DoesNotExist:
            return None
