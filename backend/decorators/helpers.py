from typing import Callable, TypeVar

from graphene import ResolveInfo
from typing_extensions import Concatenate, ParamSpec

from decorators.constants import ResolverSignature

R_f = TypeVar("R_f")
R_fn = TypeVar("R_fn")
P = ParamSpec("P")


def context(f: ResolverSignature[P, R_f]) -> Callable[[Callable[Concatenate[ResolveInfo, P], R_fn]], Callable[P, R_fn]]:
    def decorator(fn: Callable[Concatenate[ResolveInfo, P], R_fn]) -> Callable[P, R_fn]:
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R_fn:
            info = next(arg for arg in args if isinstance(arg, ResolveInfo))
            return fn(info.context, *args, **kwargs)

        return wrapper

    return decorator
