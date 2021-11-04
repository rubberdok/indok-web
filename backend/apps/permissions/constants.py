from typing import Final, Callable
from dataclasses import dataclass, field

DefaultPermissionsType = Final[list[tuple[str, str]]]

REGISTERED_USER: Final = "Registered user"
INDOK: Final = "Indøk"
ORGANIZATION: Final = "Organization member"

DEFAULT_REGISTERED_USER_PERMISSIONS: DefaultPermissionsType = [
    ("events", "view_event"),
]

DEFAULT_INDOK_PERMISSIONS: DefaultPermissionsType = [
    ("listings", "view_listing"),
    ("events", "add_signup"),
    ("events", "view_signup"),
    ("events", "change_signup"),
    ("organizations", "view_organization"),
    ("forms", "add_answer"),
    ("forms", "change_answer"),
    ("forms", "view_answer"),
    ("forms", "view_form"),
    ("forms", "add_response"),
    ("archive", "view_archivedocument"),
]

DEFAULT_ORGANIZATION_PERMISSIONS: DefaultPermissionsType = []

DEFAULT_GROUPS = {
    ORGANIZATION: DEFAULT_ORGANIZATION_PERMISSIONS,
    INDOK: DEFAULT_INDOK_PERMISSIONS,
    REGISTERED_USER: DEFAULT_REGISTERED_USER_PERMISSIONS,
}


@dataclass
class OrgPermissionGroup:
    group_type: str
    name: str
    create_description: Callable[[str], str]
    permissions: dict[str, DefaultPermissionsType] = field(default_factory=dict)


ORG_MEMBER_GROUP_TYPE: Final[str] = "ORG_MEMBER"

# Default organization permission groups
# All organizations will have ResponsibleGroups with these names and descriptions,
# though they may customize their given permissions
# The given permissions apply only to objects tied to that organization
DEFAULT_ORG_GROUPS: Final[list[OrgPermissionGroup]] = [
    OrgPermissionGroup(
        group_type=ORG_MEMBER_GROUP_TYPE,
        name="Medlem",
        create_description=(lambda org_name: f"Medlemmer av {org_name}."),
    ),
    OrgPermissionGroup(
        group_type="ORG_ADMIN",
        name="Administrator",
        create_description=(
            lambda org_name: f"Administrator av {org_name}. "
            + "Tillatelser til å endre info om foreningen, samt styre medlemmer og deres tillatelser."
        ),
        permissions={
            "Organization": [
                ("organizations", "change_organization"),
                ("organizations", "add_membership"),
            ],
            "Membership": [
                ("organizations", "change_membership"),
                ("organizations", "delete_membership"),
                ("organizations", "view_membership"),
            ],
        },
    ),
    OrgPermissionGroup(
        group_type="LISTINGS_ADMIN",
        name="Vervansvarlig",
        create_description=(
            lambda org_name: f"Vervansvarlige for {org_name}. "
            + "Tillatelser til å lage og redigere verv, samt se og behandle søknader."
        ),
        permissions={
            "Organization": [
                ("organizations", "add_listing"),
                ("organizations", "add_form"),
            ],
            "Listing": [
                ("listings", "change_listing"),
                ("listings", "delete_listing"),
            ],
            "Form": [
                ("forms", "manage_form"),
                ("forms", "change_form"),
                ("forms", "delete_form"),
            ],
        },
    ),
    OrgPermissionGroup(
        group_type="EVENTS_ADMIN",
        name="Arrangementansvarlig",
        create_description=(
            lambda org_name: f"Arrangementansvarlige for {org_name}. "
            + "Tillatelser til å lage og redigere arrangementer."
        ),
        permissions={
            "Organization": [
                ("organizations", "add_event"),
            ],
            "Event": [
                ("events", "change_event"),
                ("events", "delete_event"),
            ],
        },
    ),
]
