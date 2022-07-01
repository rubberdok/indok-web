from functools import wraps
from typing import Callable, TypeVar

from graphene import ResolveInfo
from typing_extensions import Concatenate, ParamSpec

from decorators.types import Context

R_f = TypeVar("R_f")
R_fn = TypeVar("R_fn")
P = ParamSpec("P")


def context(fn: Callable[Concatenate[Context, P], R_fn]) -> Callable[P, R_fn]:
    """
    Injects the context parameter into the wrapped function fn.

    Parameters
    ----------
    fn : Callable[Concatenate[ResolveInfo, P], R_fn]
        The function to wrap.

    Returns
    -------
    Callable[P, R_fn]
        The wrapped function with context injected.
    """

    @wraps(fn)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R_fn:
        info = next(arg for arg in args if isinstance(arg, ResolveInfo))
        return fn(info.context, *args, **kwargs)

    return wrapper
