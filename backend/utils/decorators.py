from django.apps import apps
from django.db.models import Model
from django.db.models.base import ModelBase
from django.db.models.query import QuerySet
from typing import Union
from functools import wraps
from graphql_jwt.decorators import context



def permission_required(perms, lookup_variables=None, **kwargs):
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
            raise ValueError("String format")

          model = apps.get_model(*split_model_str)
        elif isinstance(model, (Model, ModelBase, QuerySet)):
          pass
        else:
          raise ValueError(f"{model} should be of the type str, Model, ModelBase, or QuerySet, got {type(model)}")

        lookup_dict = {}

        for lookup, resolver_arg in zip(lookups[::2], lookups[1::2]):
          if resolver_arg not in kwargs:
            raise ValueError(f"The argument {resolver_arg} was not passed in the resolver function")
          lookup_dict[lookup] = kwargs[resolver_arg]
        
        obj = model.objects.get(**lookup_dict)
        print(obj, obj.id)
      if has_permissions(user=context.user, perms=perms, obj=obj, accept_global_perms=accept_global_perms):
        return resolver(*args, **kwargs)
      else:
        raise PermissionError("Not allowed")
    return wrapper
  return decorator


def has_permissions(user, perms: Union[list[str], str], obj=None, accept_global_perms=False, any_perm=False):
  print(all(user.has_perm(perm, obj) for perm in perms))
  has_permission = False
  if accept_global_perms:
    has_permission = all(user.has_perm(perm) for perm in perms)
  
  if not has_permission:
    if any_perm:
      has_permission = any(user.has_perm(perm, obj) for perm in perms)
    else:
      has_permission = all(user.has_perm(perm, obj) for perm in perms)
  
  return has_permission



 






