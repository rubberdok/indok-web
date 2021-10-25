from django.db import migrations

from typing import Final, Callable
from dataclasses import dataclass, field


@dataclass
class OrgGroup:
    group_type: str
    name: str
    create_description: Callable[[str], str]
    permissions: Final[list[tuple[str, str]]] = field(default_factory=list)


old_org_member_group = OrgGroup(
    group_type="PRIMARY",
    name="Medlem",
    create_description=(lambda org_name: f"Medlemmer av {org_name}."),
)

new_org_member_group = (
    OrgGroup(
        group_type="ORG_MEMBER",
        name="Medlem",
        create_description=(lambda org_name: f"Medlemmer av {org_name}."),
    ),
)

old_listings_admin_group = OrgGroup(
    group_type="HR",
    name="HR",
    create_description=(lambda org_name: f"HR-gruppen til {org_name}. " + "Tillatelser for å se og behandle søknader."),
)

new_listings_admin_group = OrgGroup(
    group_type="LISTINGS_ADMIN",
    name="Vervansvarlig",
    create_description=(
        lambda org_name: f"Vervansvarlige for {org_name}. "
        + "Tillatelser til å lage og redigere verv, samt se og behandle søknader."
    ),
    permissions=[
        ("organizations", "add_listing"),
        ("listings", "change_listing"),
        ("listings", "delete_listing"),
        ("organizations", "add_form"),
        ("forms", "manage_form"),
        ("forms", "change_form"),
        ("forms", "delete_form"),
    ],
)

# Takes in a list of tuples, where the first element of the tuple
# is the outdated group, and the second is the updated one
# (generalized to allow for forwards and reverse migration)
def update_default_groups(
    apps,
    old_and_new_group_tuples: list[tuple[OrgGroup, OrgGroup]],
):
    Organization = apps.get_model("organizations", "Organization")

    for organization in Organization.objects.all():
        for permission_group in organization.permission_groups.all():
            updated_group: OrgGroup = None

            for group_tuple in old_and_new_group_tuples:
                if permission_group.group_type == group_tuple[0]:
                    updated_group = group_tuple[1]
                    break

            if updated_group is not None:
                permission_group.group_type = updated_group.group_type
                permission_group.name = updated_group.name
                permission_group.description = updated_group.create_description(organization.name)
                permission_group.group.permissions.set(updated_group.permissions)
                permission_group.save()


def forwards_update_default_groups(apps, schema_editor):
    update_default_groups(
        apps,
        [
            (old_org_member_group, new_org_member_group),
            (old_listings_admin_group, new_listings_admin_group),
        ],
    )


def reverse_update_default_groups(apps, schema_editor):
    update_default_groups(
        apps,
        [
            (new_org_member_group, old_org_member_group),
            (new_listings_admin_group, old_listings_admin_group),
        ],
    )


class Migration(migrations.Migration):

    dependencies = [
        ("permissions", "0011_merge_0004_auto_20210824_2126_0010_auto_20210824_1546"),
        ("organizations", "0038_alter_organization_options"),
    ]

    operations = [migrations.RunPython(forwards_update_default_groups, reverse_update_default_groups)]
