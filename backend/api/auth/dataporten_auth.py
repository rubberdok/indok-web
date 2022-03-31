import json
from typing import TYPE_CHECKING, Type, TypedDict, cast

import jwt
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from requests.auth import HTTPBasicAuth

if TYPE_CHECKING:
    from apps.users import models


User = cast(Type["models.User"], get_user_model())


CLIENT_ID = settings.DATAPORTEN_ID

UserInfo = TypedDict(
    "UserInfo",
    {
        "sub": str,
        "name": str,
        "email": str,
        "email_verified": bool,
        "dataporten-userid_sec": list[str],
        "connect-userid_sec": list[str],
    },
)


class TokenResponse(TypedDict):
    access_token: str
    id_token: str


class DataportenAuth:
    """
    Class implementing the backend part of authenticating a user with Dataporten.
    Upon receiving an authorization code from frontend
    this class completes the authentication by obtaining an access token from Dataporten,
    which can then be used to access user data at Dataporten.
    """

    @staticmethod
    def complete_dataporten_auth(code: str) -> TokenResponse:
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
        except requests.exceptions.RequestException:
            raise RuntimeError("En feil oppstod under fullføring av Dataporten-autentisering.")

        return response.json()

    @staticmethod
    def validate_response(token_response: TokenResponse):
        """
        https://docs.feide.no/reference/oauth_oidc/openid_connect_details.html
        """
        id_token = token_response["id_token"]

        # Collect available public keys, mapping each key's ID to its parsed representation
        try:
            response = requests.get("https://auth.dataporten.no/openid/jwks")
            response.raise_for_status()
            jwks = response.json()
        except requests.exceptions.RequestException:
            raise RuntimeError("En systemfeil oppstod under validering av brukeren.")

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
        except jwt.PyJWTError:
            raise ValidationError("Kunne ikke validere brukeren.")

    @staticmethod
    def confirm_indok_enrollment(access_token: str) -> bool:
        params = {
            "Authorization": f"Bearer {access_token}",
        }
        try:
            response = requests.get(
                "https://groups-api.dataporten.no/groups/me/groups/fc:fs:fs:prg:ntnu.no:MTIØT",
                headers=params,
            )
            response.raise_for_status()
        except requests.exceptions.RequestException:
            return False

        data = response.json()

        enrolled = False
        if "basic" in data and "active" in data:
            enrolled = data["basic"] == "member" and data["active"]
        return enrolled

    @staticmethod
    def get_user(access_token: str) -> "models.User":
        """
        https://docs.feide.no/service_providers/openid_connect/oidc_authentication.html
        """
        params = {
            "Authorization": f"Bearer {access_token}",
        }
        try:
            response = requests.get("https://auth.dataporten.no/openid/userinfo", headers=params)
            response.raise_for_status()
        except requests.exceptions.RequestException:
            raise Exception("Kunne ikke hente brukerinfo fra Dataporten.")

        data: UserInfo = response.json()
        feide_userid = data["sub"]
        first_name, last_name = data["name"].rsplit(" ", 1)
        username = next(id for id in data["dataporten-userid_sec"] if id.endswith("@ntnu.no"))
        username = username[username.index(":") + 1 : username.index("@")]
        email = data["email"]
        try:
            return User.objects.get(feide_userid=feide_userid)
        except User.DoesNotExist:
            return User(
                first_name=first_name,
                last_name=last_name,
                feide_userid=feide_userid,
                email=email,
                username=username,
                feide_email=email,
            )

    @classmethod
    def authenticate_and_get_user(cls, code: str) -> "models.User":
        # Complete authentication of user
        response = cls.complete_dataporten_auth(code)
        cls.validate_response(response)

        access_token = response["access_token"]

        # Fetch user info from Dataporten
        user = cls.get_user(access_token)

        if not user.pk:
            user.is_indok = cls.confirm_indok_enrollment(access_token)

        user.last_login = timezone.now()
        user.save()
        return user
