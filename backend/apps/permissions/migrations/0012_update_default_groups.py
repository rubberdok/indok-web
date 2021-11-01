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

NEW_DEFAULT_GROUPS: Final[list[OrgGroup]] = [
    OrgGroup(
        group_type="ORG_ADMIN",
        name="Administrator",
        create_description=(
            lambda org_name: f"Administrator av {org_name}. "
            + "Tillatelser til å endre info om foreningen, samt styre medlemmer og deres tillatelser."
        ),
        permissions=[
            ("organizations", "change_organization"),
            ("organizations", "add_membership"),
            ("organizations", "change_membership"),
            ("organizations", "delete_membership"),
            ("organizations", "view_membership"),
            ("organizations", "add_responsible_group"),
            ("permissions", "change_responsible_group"),
            ("permissions", "delete_responsible_group"),
            ("permissions", "view_responsible_group"),
        ],
    ),
    OrgGroup(
        group_type="EVENTS_ADMIN",
        name="Arrangementansvarlig",
        create_description=(
            lambda org_name: f"Arrangementansvarlige for {org_name}. "
            + "Tillatelser til å lage og redigere arrangementer."
        ),
        permissions=[
            ("organizations", "add_event"),
            ("events", "change_event"),
            ("events", "delete_event"),
        ],
    ),
]

# Takes in a list of tuples, where the first element of the tuple
# is the outdated group, and the second is the updated one
# (generalized to allow for forwards and reverse migration)
def update_default_groups(
    apps,
    groups_to_update: list[tuple[OrgGroup, OrgGroup]],
    groups_to_remove: list[OrgGroup],
):
    Organization = apps.get_model("organizations", "Organization")

    for organization in Organization.objects.all():
        existing_groups_to_remove = []

        for existing_group in organization.permission_groups.all():
            updated_group: OrgGroup = None

            for group_tuple in groups_to_update:
                if existing_group.group_type == group_tuple[0]:
                    updated_group = group_tuple[1]
                    break

            if updated_group is not None:
                existing_group.group_type = updated_group.group_type
                existing_group.name = updated_group.name
                existing_group.description = updated_group.create_description(organization.name)
                existing_group.group.permissions.set(updated_group.permissions)
                existing_group.save()
                break

            for group_to_remove in groups_to_remove:
                if existing_group.group_type == group_to_remove.group_type:
                    existing_groups_to_remove.append(group_to_remove)

        if len(existing_groups_to_remove) > 0:
            organization.permission_groups.set(
                filter(
                    lambda existing_group: existing_group not in existing_groups_to_remove,
                    organization.permission_groups.all(),
                )
            )
        else:
            # If not removing groups, this means we are going forwards and want to add new default groups
            # Therefore we call save() to trigger ensure_default_groups signal
            organization.save()


def forwards_update_default_groups(apps, schema_editor):
    update_default_groups(
        apps,
        groups_to_update=[
            (old_org_member_group, new_org_member_group),
            (old_listings_admin_group, new_listings_admin_group),
        ],
        groups_to_remove=[],
    )


def reverse_update_default_groups(apps, schema_editor):
    update_default_groups(
        apps,
        groups_to_update=[
            (new_org_member_group, old_org_member_group),
            (new_listings_admin_group, old_listings_admin_group),
        ],
        groups_to_remove=NEW_DEFAULT_GROUPS,
    )


class Migration(migrations.Migration):

    dependencies = [
        ("permissions", "0011_merge_0004_auto_20210824_2126_0010_auto_20210824_1546"),
        ("organizations", "0038_alter_organization_options"),
    ]

    operations = [migrations.RunPython(forwards_update_default_groups, reverse_update_default_groups)]
