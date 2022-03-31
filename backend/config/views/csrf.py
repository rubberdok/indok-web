from django.http import HttpRequest, JsonResponse
from django.middleware.csrf import get_token


def csrf(request: HttpRequest):
    return JsonResponse({"csrfToken": get_token(request)})
