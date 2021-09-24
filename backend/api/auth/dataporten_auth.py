import json
from typing import Optional

import jwt
import requests
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from requests.auth import HTTPBasicAuth
from django.conf import settings
from django.utils import timezone

UserModel = get_user_model()

CLIENT_ID = settings.DATAPORTEN_ID


class DataportenAuth:
    """
    Class implementing the backend part of authenticating a user with Dataporten.
    Upon receiving an authorization code from frontend
    this class completes the authentication by obtaining an access token from Dataporten,
    which can then be used to access user data at Dataporten.
    """

    @staticmethod
    def complete_dataporten_auth(code):
        """
        https://docs.feide.no/service_providers/openid_connect/feide_obtaining_tokens.html
        """
        params = {
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.DATAPORTEN_REDIRECT_URI,
            "client_id": CLIENT_ID,
        }

        try:
            response = requests.post(
                "https://auth.dataporten.no/oauth/token",
                params,
                auth=HTTPBasicAuth(
                    CLIENT_ID,
                    settings.DATAPORTEN_SECRET,
                ),
            )
            # Raises exceptions upon HTTP errors
            response.raise_for_status()
        except requests.exceptions.RequestException as err:
            raise Exception("En feil oppstod under fullføring av Dataporten-autentisering.")

        return response.json()

    @staticmethod
    def validate_response(resp):
        """
        https://docs.feide.no/reference/oauth_oidc/openid_connect_details.html
        """
        if resp is None:
            return None

        id_token = resp["id_token"]

        # Collect available public keys, mapping each key's ID to its parsed representation
        try:
            response = requests.get("https://auth.dataporten.no/openid/jwks")
            response.raise_for_status()
            jwks = response.json()
        except requests.exceptions.RequestException as err:
            raise Exception("En systemfeil oppstod under validering av brukeren.")

        public_keys = {}
        for jwk in jwks["keys"]:
            kid = jwk["kid"]
            public_keys[kid] = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

        # look up the public key corresponding to the private key with which the token was signed
        kid = jwt.get_unverified_header(id_token)["kid"]
        key = public_keys[kid]

        try:
            jwt.decode(
                id_token,
                key=key,
                algorithms=["RS256"],
                issuer="https://auth.dataporten.no",
                audience=CLIENT_ID,
            )
        except jwt.PyJWTError as e:
            raise ValidationError("Kunne ikke validere brukeren.")

    @staticmethod
    def confirm_indok_enrollment(access_token):
        if access_token is None:
            return None

        params = {
            "Authorization": f"Bearer {access_token}",
        }
        try:
            response = requests.get(
                "https://groups-api.dataporten.no/groups/me/groups/fc:fs:fs:prg:ntnu.no:MTIØT",
                headers=params,
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as err:
            return False

        data = response.json()

        enrolled = False
        if "basic" in data and "active" in data:
            enrolled = data["basic"] == "member" and data["active"] == True

        if not enrolled:
            return False

        return True

    @staticmethod
    def get_user_info(access_token):
        """
        https://docs.feide.no/service_providers/openid_connect/oidc_authentication.html
        """
        if access_token is None:
            return None

        params = {
            "Authorization": f"Bearer {access_token}",
        }
        try:
            response = requests.get("https://auth.dataporten.no/userinfo", headers=params)
            response.raise_for_status()
        except requests.exceptions.RequestException as err:
            raise Exception("Kunne ikke hente brukerinfo fra Dataporten.")

        data = response.json()
        user_info = data["user"]

        username = user_info["userid_sec"][0].split(":")[1].split("@")[0]
        feide_userid = user_info["userid"]
        email = user_info["email"]
        name = user_info["name"]
        # picture = "https://api.dataporten.no/userinfo/v1/user/media/" + user_info["profilephoto"] #TODO: add profile photo
        return (username, feide_userid, email, name)

    @classmethod
    def authenticate_and_get_user(cls, code: Optional[str] = None) -> tuple[Optional[UserModel], Optional[str]]:
        if code is None:
            raise ValidationError("Ugyldig autentiseringskode i forespørselen.")

        # Complete authentication of user
        response = cls.complete_dataporten_auth(code)
        cls.validate_response(response)

        access_token = response.get("access_token")
        id_token: Optional[str] = response.get("id_token")

        # Fetch user info from Dataporten
        user_info = cls.get_user_info(access_token)
        if user_info is None:
            return None, id_token

        username, feide_userid, email, name = user_info

        # Create or update user
        try:
            user = UserModel.objects.get(feide_userid=feide_userid)
            # User exists, update user info
            user.id_token = id_token
            user.last_login = timezone.now()
            user.save()

        except UserModel.DoesNotExist:
            # Check if user is member of MTIØT group (studies indøk)
            enrolled = cls.confirm_indok_enrollment(access_token)

            # User does not exist, create a new user
            user = UserModel(
                username=username,
                feide_email=email,
                first_name=name,
                feide_userid=feide_userid,
                id_token=id_token,
                last_login=timezone.now(),
                indok=enrolled,
            )
            user.save()
        return user, id_token
