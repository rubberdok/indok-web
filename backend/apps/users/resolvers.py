from django.contrib.auth import get_user_model
from graphql_jwt.decorators import staff_member_required


class UserResolvers:
    def resolve_user(self, info):
        if isinstance(info.context.user, get_user_model()) and not info.context.user.is_anonymous:
            return info.context.user
        else:
            return None

    @staff_member_required
    def resolve_all_users(self, info):
        return get_user_model().objects.all()
