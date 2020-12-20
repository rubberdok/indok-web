import requests
from requests.auth import HTTPBasicAuth
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import User


class GetTokenView(APIView):
    def post(self, request):
        """
        Return a list of all users.
        """
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
        print(response)
        resp = response.json()
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
