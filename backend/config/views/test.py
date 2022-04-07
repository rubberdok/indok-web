from django.contrib.auth import get_user_model, login
from django.http import HttpRequest, JsonResponse


def test_session(request: HttpRequest):
    try:
        login(
            request,
            get_user_model().objects.get(username="eva_student"),
            backend="django.contrib.auth.backends.ModelBackend",
        )
        return JsonResponse({"username": request.user.username})
    except get_user_model().DoesNotExist:
        return JsonResponse({"username": None})
