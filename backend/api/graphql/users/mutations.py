import graphene
from apps.users.models import User
from .types import UserType


class UserInput(graphene.InputObjectType):
    username = graphene.String()
    year = graphene.Int()
    password = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    ok = graphene.Boolean()
    class Arguments:
        user_data = UserInput(required=True)

    @classmethod
    def mutate(cls, self, info, user_data):
        user: User = User()
        for key, value in user_data.items():
            setattr(user, key, value)
        user.save()
        ok = True
        return cls(user=user, ok=ok)