from functools import wraps
from typing import TYPE_CHECKING, Callable, TypeVar

from django.core.exceptions import PermissionDenied
from typing_extensions import ParamSpec

from .constants import PERMISSION_REQUIRED_ERROR, ResolverSignature
from .helpers import context

if TYPE_CHECKING:
    from apps.users import models


R = TypeVar("R")
P = ParamSpec("P")


def user_passes_test(
    test_fn: Callable[["models.User"], bool],
    exception: Exception = PermissionDenied(PERMISSION_REQUIRED_ERROR),
):
    def decorator(fn: ResolverSignature[P, R]) -> Callable[P, R]:
        @wraps(fn)
        @context(fn)
        def wrapper(context, *args: P.args, **kwargs: P.kwargs) -> R:
            user: "models.User" = context.user
            if test_fn(user):
                return fn(*args, **kwargs)
            raise exception

        return wrapper

    return decorator


login_required = user_passes_test(lambda user: user.is_authenticated)
superuser_required = user_passes_test(lambda user: user.is_superuser)
staff_member_required = user_passes_test(lambda user: user.is_staff)
