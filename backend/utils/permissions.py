from typing import TYPE_CHECKING
from apps.permissions.constants import DEFAULT_ORG_GROUPS
from guardian.shortcuts import assign_perm

if TYPE_CHECKING:
    from apps.organizations.models import Organization
    from django.db.models import Model


def assign_object_permissions(app: str, instance: Model, organization: Organization) -> None:
    for default_group in DEFAULT_ORG_GROUPS:
        for permission_group in organization.permission_groups.all():
            if permission_group.group_type == default_group.group_type:
                for permission in default_group.permissions:
                    if permission[0] == app:
                        assign_perm(f"{permission[0]}.{permission[1]}", permission_group.group, instance)
