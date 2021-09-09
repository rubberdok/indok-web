from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model


class IndokWebJWTMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        jwt_token = getattr(request, "set_jwt_cookie", None)
        if jwt_token:
            response.set_cookie("JWT", jwt_token, max_age=24 * 60 * 60, httponly=True)

        return response


class AnonymousUserMiddleware(object):
    def resolve(self, next, root, info, **args):
        if isinstance(info.context.user, AnonymousUser):
            User = get_user_model()
            anon = User.get_anonymous()
            info.context.user = anon
        return next(root, info, **args)
