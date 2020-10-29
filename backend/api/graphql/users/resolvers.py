from apps.users.models import User

class UserResolvers:
    def resolve_user(self, info, id):
        try:
            return User.objects.get(pk=id)
        except User.DoesNotExist as err:
            return None

    def resolve_users(self, info):
        return User.objects.all()