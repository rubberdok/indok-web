from functools import wraps
from typing import TYPE_CHECKING, Callable, TypeVar

from django.core.exceptions import PermissionDenied
from typing_extensions import ParamSpec

from .constants import PERMISSION_REQUIRED_ERROR
from .helpers import context
from .types import Context, ResolverSignature

if TYPE_CHECKING:
    from apps.users import models


R = TypeVar("R")
P = ParamSpec("P")


def user_passes_test(
    test_fn: Callable[["models.User"], bool],
    exception: Exception = PermissionDenied(PERMISSION_REQUIRED_ERROR),
):
    """
    Create a decorator for a function that checks if the user passes the given test.

    Parameters
    ----------
    test_fn : Callable[[models.User], bool]
        The test function the user has to pass
    exception : Exception, optional
        Raised if the user does not pass the test function, by default PermissionDenied(PERMISSION_REQUIRED_ERROR)
    """

    def decorator(fn: ResolverSignature[P, R]) -> Callable[P, R]:
        @wraps(fn)
        @context
        def wrapper(context: Context, *args: P.args, **kwargs: P.kwargs) -> R:
            user: "models.User" = context.user
            if test_fn(user):
                return fn(*args, **kwargs)
            raise exception

        return wrapper

    return decorator


login_required = user_passes_test(lambda user: user.is_authenticated)
superuser_required = user_passes_test(lambda user: user.is_superuser)
staff_member_required = user_passes_test(lambda user: user.is_staff)
