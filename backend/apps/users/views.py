import json

import jwt
import requests
from requests.auth import HTTPBasicAuth
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import User


class GetTokenView(APIView):
    def post(self, request):
        print("Get token view hit!")
        print(request.data)
        params = {
            **request.data,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:3000/cb",
        }
        print(params)
        response = requests.post(
            "https://auth.dataporten.no/oauth/token",
            params,
            auth=HTTPBasicAuth(
                "f17d2ea0-a7c9-4458-83bf-35cf5b555cae",
                "862ac077-2118-4c25-b047-1b99e90a0e9b",
            ),
        )
        print(response.json())
        resp = response.json()
        id_token = resp["id_token"]

        # Collect available public keys, mapping each key's ID to its parsed representation
        jwks = requests.get("https://auth.dataporten.no/openid/jwks").json()
        public_keys = {}
        for jwk in jwks["keys"]:
            kid = jwk["kid"]
            public_keys[kid] = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

        # look up the public key corresponding to the private key with which the token was signed
        kid = jwt.get_unverified_header(id_token)["kid"]
        key = public_keys[kid]

        payload = jwt.decode(
            id_token,
            key=key,
            algorithms=["RS256"],
            issuer="https://auth.dataporten.no",
            audience="f17d2ea0-a7c9-4458-83bf-35cf5b555cae",
        )
        print(payload)

        access_token = resp["access_token"]

        params = {
            "Authorization": f"Bearer {access_token}",
        }
        response = requests.get("https://auth.dataporten.no/userinfo", headers=params)
        data = response.json()

        userinfo = data["user"]

        print(userinfo)

        user = User.objects.filter(feide_userid=userinfo["userid"])

        username = userinfo["userid_sec"][0].split(":")[1].split("@")[0]
        if user.exists():
            print("User exists, updating in the database")
            user.update(
                username=username,
                email=f"{username}@stud.ntnu.no",
                first_name=userinfo["name"],
                feide_userid=userinfo["userid"],
                year=4,
            )
            return Response({"response": "The user already exists, updating"})
        else:
            print("User does not exist, creating in the database")
            User.objects.create(
                username=username,
                email=f"{username}@stud.ntnu.no",
                first_name=userinfo["name"],
                feide_userid=userinfo["userid"],
                year=4,
            )
            return Response({"response": "The user does not already exist, created"})
