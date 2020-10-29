from functools import wraps
from graphql.execution.base import ResolveInfo

from django.core.exceptions import PermissionDenied

"""
Decorators for authenitction to be used on resolvers.

Source: django-graphql-jwt
For example use, see
https://django-graphql-jwt.domake.io/en/latest/decorators.html
"""
__all__ = [
    "user_passes_test",
    "login_required",
    "staff_member_required",
    "superuser_required",
    "permission_required",
]


def context(f):
    """
    Passes user context as first argument to wrapped function.
    Note: when graphene supports graphql-core 3, ResolveInfo should be replaced with:
    from graphql.execution.execute import GraphQLResolveInfo
    """

    def decorator(func):
        def wrapper(*args, **kwargs):
            info = next(arg for arg in args if isinstance(arg, ResolveInfo))
            return func(info.context, *args, **kwargs)

        return wrapper

    return decorator


def user_passes_test(test_func):
    """
    Uses @context to fetch user context from list of arguments.
    Checks whether user context passes the given test.
    If so, the original function is returned by the decorator.
    """

    def decorator(f):
        @wraps(f)
        @context(f)
        def wrapper(context, *args, **kwargs):
            if test_func(context.user):
                return f(*args, **kwargs)
            raise PermissionDenied("You do not have permission to perform this action")

        return wrapper

    return decorator


login_required = user_passes_test(lambda u: u.is_authenticated)
staff_member_required = user_passes_test(lambda u: u.is_staff)
superuser_required = user_passes_test(lambda u: u.is_superuser)


def permission_required(perm):
    def check_perms(user):
        if isinstance(perm, str):
            perms = (perm,)
        else:
            perms = perm
        return user.has_perms(perms)

    return user_passes_test(check_perms)
