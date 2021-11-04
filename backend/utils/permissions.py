from typing import TYPE_CHECKING
from apps.permissions.constants import DEFAULT_ORG_PERMISSION_GROUPS
from guardian.shortcuts import assign_perm

if TYPE_CHECKING:
    from apps.organizations.models import Organization
    from django.db.models import Model


def assign_object_permissions(app_name: str, model_name: str, instance: Model, organization: Organization) -> None:
    for permission_group in organization.permission_groups.all():
        if permission_group.group_type in DEFAULT_ORG_PERMISSION_GROUPS:
            default_group = DEFAULT_ORG_PERMISSION_GROUPS[permission_group.group_type]

            if app_name in default_group.permissions:
                app_permissions = default_group.permissions[app_name]

                if model_name in app_permissions:
                    model_permissions = app_permissions[model_name]

                    for permission in model_permissions:
                        assign_perm(f"{app_name}.{permission}", permission_group.group, instance)
