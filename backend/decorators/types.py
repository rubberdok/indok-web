from typing import Callable, Protocol, TypeVar, TYPE_CHECKING

from typing_extensions import ParamSpec

if TYPE_CHECKING:
    from apps.users.models import User


class Context(Protocol):
    user: User


R = TypeVar("R")
P = ParamSpec("P")

ResolverSignature = Callable[P, R]
