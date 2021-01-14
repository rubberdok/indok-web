import json

import jwt
import requests
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied, ValidationError
from requests.auth import HTTPBasicAuth
from django.conf import settings

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
        print("1. Completing dataporten authentication")
        params = {
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.DATAPORTEN_REDIRECT_URI,
            "client_id": CLIENT_ID,
        }

        try:
            print(CLIENT_ID, settings.DATAPORTEN_SECRET)
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
            print(f"Error completing Dataporten authentication: {err}")
            raise Exception(
                "En feil oppstud under fullføring av Dataporten-autentisering."
            )

        print(f"Successfully obtained access token: {response.json()['access_token']}")

        return response.json()

    @staticmethod
    def validate_response(resp):
        """
        https://docs.feide.no/reference/oauth_oidc/openid_connect_details.html
        """
        if resp is None:
            return None

        print("\n2. Validating id_token")
        id_token = resp["id_token"]

        # Collect available public keys, mapping each key's ID to its parsed representation
        try:
            response = requests.get("https://auth.dataporten.no/openid/jwks")
            response.raise_for_status()
            jwks = response.json()
        except requests.exceptions.RequestException as err:
            print(f"Error fetching Dataporten public keys: {err}")
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
            print(f"Error validating id_token: {e}")
            raise ValidationError("Kunne ikke validere brukeren.")

        print("The id_token was successfully validated")

    @staticmethod
    def confirm_indok_enrollment(access_token):
        print("\n3. Confirming indøk enrollment")
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
            print(f"Error confirming indøk enrollment: {err}")
            raise PermissionDenied(
                "Beklager, kun studenter som studerer Industriell Økonomi og Teknologiledelse (MTIØT) kan logge inn."
            )

        data = response.json()
        print(f"Indøk enrollment info: {json.dumps(data)}")

        enrolled = False
        if "basic" in data and "active" in data:
            enrolled = data["basic"] == "member" and data["active"] == True

        if not enrolled:
            raise PermissionDenied(
                "Beklager, kun studenter som studerer Industriell Økonomi og Teknologiledelse (MTIØT) kan logge inn."
            )

        print("User is enrolled at indøk")

    @staticmethod
    def get_user_info(access_token):
        """
        https://docs.feide.no/service_providers/openid_connect/oidc_authentication.html
        """
        if access_token is None:
            return None

        print("\n4. Fetching user info from Dataporten")

        params = {
            "Authorization": f"Bearer {access_token}",
        }
        try:
            response = requests.get(
                "https://auth.dataporten.no/userinfo", headers=params
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as err:
            print(f"Error fetching user info: {err}")
            raise Exception("Kunne ikke hente brukerinfo fra Dataporten.")

        print(f"Successfully fetched user info for {response.json()['user']['name']}")

        data = response.json()
        user_info = data["user"]

        username = user_info["userid_sec"][0].split(":")[1].split("@")[0]
        feide_userid = user_info["userid"]
        email = user_info["email"]
        name = user_info["name"]
        # picture = "https://api.dataporten.no/userinfo/v1/user/media/" + user_info["profilephoto"] #TODO: add profile photo
        year = 4  # TODO: update when access to study year
        return (username, feide_userid, email, name, year)

    @classmethod
    def authenticate_and_get_user(cls, code=None):
        print(f"\n{'='*20}Authentication flow started{'='*20}")
        if code is None:
            raise ValidationError("Ugyldig autentiseringskode i forespørselen.")

        # Complete authentication of user
        response = cls.complete_dataporten_auth(code)
        cls.validate_response(response)

        access_token = response.get("access_token")

        # Check if user is member of MTIØT group (studies indøk)
        cls.confirm_indok_enrollment(access_token)

        # Fetch user info from Dataporten
        user_info = cls.get_user_info(access_token)
        if user_info is None:
            return None

        username, feide_userid, email, name, year = user_info

        # Create or update user
        try:
            user = UserModel.objects.get(feide_userid=feide_userid)
            # User exists, update user info
            print(f"\nUser {username} exists, updating in the database")
            user.username = username
            user.email = email
            user.first_name = name
            user.feide_userid = feide_userid
            user.year = year
            user.save()

        except UserModel.DoesNotExist:
            print(f"\nUser {username} does not exist, creating in the database")
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
