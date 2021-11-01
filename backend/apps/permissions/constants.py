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
class OrgGroup:
    group_type: str
    name: str
    create_description: Callable[[str], str]
    permissions: DefaultPermissionsType = field(default_factory=list)


ORG_MEMBER_GROUP_TYPE: Final[str] = "ORG_MEMBER"

# Default organization permission groups
# All organizations will have ResponsibleGroups with these names and descriptions,
# though they may customize their given permissions
# The given permissions apply only to objects tied to that organization
DEFAULT_ORG_GROUPS: Final[list[OrgGroup]] = [
    OrgGroup(
        group_type=ORG_MEMBER_GROUP_TYPE,
        name="Medlem",
        create_description=(lambda org_name: f"Medlemmer av {org_name}."),
    ),
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
        ],
    ),
    OrgGroup(
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
