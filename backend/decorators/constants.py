from typing import Callable, TypeVar

from typing_extensions import ParamSpec

PERMISSION_REQUIRED_ERROR = "You do not have the permissions required."
LOGIN_REQUIRED_ERROR = "You are not authenticated."


R = TypeVar("R")
P = ParamSpec("P")

ResolverSignature = Callable[P, R]
