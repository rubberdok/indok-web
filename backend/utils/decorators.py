from functools import wraps
from typing import Union

from django.apps import apps
from django.db.models import Model
from django.db.models.base import ModelBase
from graphql_jwt.decorators import context


def permission_required(
    perms: Union[list[str], str],
    lookup_variables: tuple[Union[Model, ModelBase, str], ...] = None,
    **kwargs,
):
    """Decorator to check for row level permissions

    Parameters
    ----------
    perms : Union[list[str], str]
        A permission or list of permissions in the format app_label.action_modelname.
    lookup_variables : tuple[Union[Model, ModelBase, str], ...], optional
        A tuple with: (1) the model which to look up, (2) a series of attribute name, parameter name pairs to use for the lookup, by default None
    accept_global_perms : bool
        Whether global permissions are permitted, i.e. does not require object-level permission, by default False

    Raises
    ------
    SyntaxError
        If the first element of the lookup tuple is a str, but not of the format app_label.ModelClass
    TypeError
        If the first element of the lookup tuple is not of the type str, Model, or ModelClass
    ValueError
        If the lookup variables are not in a attribute name, parameter name format, i.e. of even length
    KeyError
        If the attributes to look up are not part of the wrapped function.
    PermissionError
        If the user does not have the required permissions.
    """

    accept_global_perms = kwargs.pop("accept_global_perms", False)
    if isinstance(perms, str):
        perms = [perms]

    def decorator(resolver):
        @wraps(resolver)
        @context(resolver)
        def wrapper(context, *args, **kwargs):
            obj = None
            if lookup_variables:
                model, lookups = lookup_variables[0], lookup_variables[1:]

                if isinstance(model, str):
                    split_model_str = model.split(".")

                    if len(split_model_str) != 2:
                        raise SyntaxError(
                            f"The model string should be of the format app_label.ModelClass, got {model}."
                        )

                    model = apps.get_model(*split_model_str)
                elif not isinstance(model, (Model, ModelBase)):
                    raise TypeError(
                        f"{model} should be of the type str, Model, or ModelBase, got {type(model)}"
                    )

                lookup_dict = {}

                if len(lookups) % 2 != 0:
                    raise ValueError(
                        f"The lookups should come in pairs of strings in the format attribute name, parameter name."
                    )

                for lookup, resolver_arg in zip(lookups[::2], lookups[1::2]):
                    if resolver_arg not in kwargs:
                        raise KeyError(
                            f"The argument {resolver_arg} was not passed in the resolver function."
                        )
                    lookup_dict[lookup] = kwargs[resolver_arg]

                obj = model.objects.get(**lookup_dict)

            if has_permissions(
                user=context.user,
                perms=perms,
                obj=obj,
                accept_global_perms=accept_global_perms,
            ):
                return resolver(*args, **kwargs)

            raise PermissionError("You do not have the permissions required.")

        return wrapper

    return decorator


def has_permissions(
    user, perms: list[str], obj=None, accept_global_perms: bool = False
) -> bool:
    """Check if the user has the required permissions

    Parameters
    ----------
    user : AUTH_USER_MODEL
        The user making the request
    perms : list[str]
        List of permissions in the format app_label.action_model
    obj : optional
        The requested object, by default None
    accept_global_perms : bool, optional
        Whether global permissions are permitted, i.e. does not require object-level permission, by default False

    Returns
    -------
    bool
        True if the user has permission, False otherwise
    """
    return (accept_global_perms and all(user.has_perm(perm) for perm in perms)) or all(
        user.has_perm(perm, obj) for perm in perms
    )
