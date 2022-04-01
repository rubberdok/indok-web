from django.http import HttpRequest, JsonResponse
from django.middleware.csrf import get_token


def csrf(request: HttpRequest):
    response = JsonResponse({"csrfToken": get_token(request)})
    response.delete_cookie("csrftoken", domain="api.indokntnu.no", path="/")
    return response
