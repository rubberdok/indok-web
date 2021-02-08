from graphql_jwt.decorators import login_required, staff_member_required
from django.contrib.auth import get_user_model


class UserResolvers:
    def resolve_user(parent, info):
        if isinstance(info.context.user, get_user_model()):
            return info.context.user
        else:
            return None

    @staff_member_required
    def resolve_all_users(parent, info):
        return get_user_model().objects.all()
