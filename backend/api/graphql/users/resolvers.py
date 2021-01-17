from graphql_jwt.decorators import login_required, staff_member_required
from django.contrib.auth import get_user_model


class UserResolvers:
    @login_required
    def resolve_user(parent, info, id):
        # Old
        if id:
            try:
                return get_user_model().objects.get(pk=id)
            except get_user_model().DoesNotExist as err:
                return None
        # Remove everything above when new user system is integrated in surveys/listings
        return info.context.user

    @staff_member_required
    def resolve_all_users(parent, info):
        return get_user_model().objects.all()
