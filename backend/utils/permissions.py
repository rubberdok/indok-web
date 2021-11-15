from typing import TYPE_CHECKING
from apps.permissions.constants import DEFAULT_ORG_PERMISSION_GROUPS
from guardian.shortcuts import assign_perm

if TYPE_CHECKING:
    from apps.organizations.models import Organization
    from django.db.models import Model


def assign_object_permissions(app_name: str, model_name: str, instance: "Model", organization: "Organization") -> None:
    """
    Takes in a newly created instance of a model, and the organization tied to it.
    Assigns permissions on the instance to the organization's appropriate permission groups.
    """
    for permission_group in organization.permission_groups.all():
        # Using try-except due to Python's "Easier to Ask for Forgiveness than Permission" principle
        try:
            permissions = DEFAULT_ORG_PERMISSION_GROUPS[permission_group.group_type].permissions[app_name][model_name]

            for permission in permissions:
                assign_perm(f"{app_name}.{permission}", permission_group.group, instance)

        except KeyError:
            continue
