from django.conf import settings

from django.contrib.auth import get_user_model
from decorators import staff_member_required, PermissionDenied
from django.contrib.auth import logout, login


class UserResolvers:
    def resolve_user(self, info):
        if isinstance(info.context.user, get_user_model()) and not info.context.user.is_anonymous:
            return info.context.user
        else:
            return None

    @staff_member_required
    def resolve_all_users(self, info):
        return get_user_model().objects.all()

    def resolve_logout(self, info):
        user = info.context.user
        logout(info.context)
        return user.id_token

    if settings.ENVIRONMENT == "test":

        def resolve_test_auth(self, info):
            if settings.ENVIRONMENT == "test":
                try:
                    login(
                        info.context,
                        get_user_model().objects.get(username="eva_student"),
                        backend="django.contrib.auth.backends.ModelBackend",
                    )
                    return info.context.user
                except get_user_model().DoesNotExist:
                    return None
            else:
                raise PermissionDenied("You do not have the permissions required.")
