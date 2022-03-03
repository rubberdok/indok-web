from typing import TYPE_CHECKING
from apps.permissions.constants import DEFAULT_ORG_PERMISSION_GROUPS
from guardian.shortcuts import assign_perm

if TYPE_CHECKING:
    from apps.organizations.models import Organization
    from django.db.models import Model


def assign_object_permissions(app: str, model: str, instance: "Model", organization: "Organization") -> None:
    """
    Takes in a newly created instance of a model, and the organization tied to it.
    Assigns permissions on the instance to the organization's appropriate permission groups.
    """
    for permission_group in organization.permission_groups.all():
        # Using try-except due to Python's "Easier to Ask for Forgiveness than Permission" principle
        try:
            perms = DEFAULT_ORG_PERMISSION_GROUPS[permission_group.group_type].formatted_model_permissions(app, model)

            for perm in perms:
                assign_perm(perm, permission_group.group, instance)

        except KeyError:
            continue
