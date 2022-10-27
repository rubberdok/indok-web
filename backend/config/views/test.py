from django.contrib.auth import get_user_model, login
from django.http import HttpRequest, JsonResponse


def test_session(request: HttpRequest):
    try:
        login(
            request,
            get_user_model().objects.get(feide_userid="557669b3-af64-4a55-b97e-57c0836efef6"),
            backend="django.contrib.auth.backends.ModelBackend",
        )
        return JsonResponse({"username": request.user.username})
    except get_user_model().DoesNotExist:
        return JsonResponse({"username": None})
