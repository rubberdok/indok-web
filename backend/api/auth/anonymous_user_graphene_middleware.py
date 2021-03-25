from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model


class AnonymousUserMiddleware(object):
    def resolve(self, next, root, info, **args):
        if isinstance(info.context.user, AnonymousUser):
            User = get_user_model()
            anon = User.get_anonymous()
            info.context.user = anon
        return next(root, info, **args)