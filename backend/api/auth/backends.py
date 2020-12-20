from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend

from .dataporten_auth import DataportenAuth

UserModel = get_user_model()


class IndokWebBackend(BaseBackend):
    """
    https://docs.djangoproject.com/en/3.1/topics/auth/customizing/#writing-an-authentication-backend
    """

    def authenticate(self, request=None, code=None, state=None):

        if code is None:
            return None

        dataporten = DataportenAuth()

        # Complete authentication of user
        response = dataporten.complete_dataporten_auth(code, state)
        if not dataporten.validate_response(response):
            return None

        # Fetch user info from Dataporten
        username, feide_userid, email, name, year = dataporten.get_user_info(response)
        if username is None:
            return None

        # TODO: check that user goes to indøk
        try:
            user = UserModel.objects.get(feide_userid=feide_userid)
            # User exists, update user info
            print(f"User {username} exists, updating in the database")
            user.username = username
            user.email = email
            user.first_name = name
            user.feide_userid = feide_userid
            user.year = year
            user.save()

        except UserModel.DoesNotExist:
            print("User does not exist, creating in the database")
            # User does not exist, create a new user
            user = UserModel(
                username=username,
                email=email,
                first_name=name,
                feide_userid=feide_userid,
                year=year,
            )
            user.save()
        return user

    def get_user(self, user_id):
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
