from graphql_jwt.decorators import login_required
from django.contrib.auth import get_user_model


class UserResolvers:
    @login_required
    def resolve_user(parent, info):
        return info.context.user

    @login_required
    def resolve_all_users(parent, info):
        return get_user_model().objects.all()
