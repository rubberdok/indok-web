import os

DATAPORTEN_SCOPES = [
    "openid",
    "userid",
    "userid-feide",
    "userinfo-name",
    "userinfo-photo",
    "email",
    "groups-edu",
]


def generate_login_link() -> str:
    client_id = os.getenv("NEXT_PUBLIC_DATAPORTEN_ID")
    # state = os.getenv("NEXT_PUBLIC_DATAPORTEN_ID")
    # redirect_uri = os.getenv("NEXT_PUBLIC_DATAPORTEN_ID")
    # response_type = "code"
    # scope = " ".join(DATAPORTEN_SCOPES)

    query_string = f"?client_id={client_id}&"

    return "https://auth.dataporten.no/oauth/authorization" + query_string
