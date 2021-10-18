from typing import Final, Literal, Callable
from dataclasses import dataclass, field

DefaultPermissionsType = Final[list[tuple[str, str]]]

ORGANIZATION: Final = "Organization member"
INDOK: Final = "Indøk"
REGISTERED_USER: Final = "Registered user"


@dataclass
class OrgGroup:
    type_name: str
    descriptive_name: str
    create_description: Callable[str, str]
    generic_permissions: list[str] = field(default_factory=list)
    object_permissions: list[str] = field(default_factory=list)


DEFAULT_ORG_GROUPS: Final[list[OrgGroup]] = [
    OrgGroup(
        type_name="PRIMARY",
        descriptive_name="Medlem",
        create_description=(
            lambda org_name: f"Vervansvarlige for {org_name}."
            + "Tillatelser til å lage og redigere verv, samt se og behandle søknader."
        ),
    ),
    OrgGroup(
        type_name="HR",
        descriptive_name="Vervansvarlig",
        create_description=(lambda org_name: f"Medlemmer av {org_name}."),
        generic_permissions=["forms.add_form"],
    ),
    OrgGroup(
        type_name="ORG_ADMIN",
        descriptive_name="Administrator",
        create_description=(
            lambda org_name: f"Administrator av {org_name}."
            + "Tillatelser til å endre info om organisasjonen, samt styre medlemmer og deres tillatelser."
        ),
    ),
]

# Default ResponsibleGroup types
PRIMARY_TYPE: Literal["PRIMARY"] = "PRIMARY"
PRIMARY_GROUP_NAME: Final = "Medlem"

HR_TYPE: Literal["HR"] = "HR"
HR_GROUP_NAME: Final = "HR"

DEFAULT_ORGANIZATION_PERMISSIONS: DefaultPermissionsType = [
    ("events", "add_event"),
    ("events", "change_event"),
    ("events", "delete_event"),
    ("listings", "add_listing"),
    ("listings", "change_listing"),
    ("listings", "delete_listing"),
    ("organizations", "add_membership"),
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

DEFAULT_REGISTERED_USER_PERMISSIONS: DefaultPermissionsType = [
    ("events", "view_event"),
]

DEFAULT_GROUPS = {
    ORGANIZATION: DEFAULT_ORGANIZATION_PERMISSIONS,
    INDOK: DEFAULT_INDOK_PERMISSIONS,
    REGISTERED_USER: DEFAULT_REGISTERED_USER_PERMISSIONS,
}
