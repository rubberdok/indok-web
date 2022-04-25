from typing import TYPE_CHECKING, cast
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model

if TYPE_CHECKING:
    from apps.users import models


class AnonymousUserMiddleware(object):
    def resolve(self, next, root, info, **args):
        if isinstance(info.context.user, AnonymousUser):
            # Casts from a Django anonymous user to a Django Guardian anonymous user
            # (what we use), since they are different:
            # https://django-guardian.readthedocs.io/en/stable/configuration.html
            User = cast("models.User", get_user_model())
            anon = User.get_anonymous()
            info.context.user = anon
        return next(root, info, **args)
