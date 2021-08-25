from typing import Final, Literal

DefaultPermissionsType = Final[list[tuple[str, str]]]

# Default ResponsibleGroup types
PRIMARY_TYPE: Literal["PRIMARY"] = "PRIMARY"
HR_TYPE: Literal["HR"] = "HR"

ORGANIZATION: Final = "Organization member"
INDOK: Final = "Indøk"
PRIMARY_GROUP_NAME: Final = "Medlem"
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
    ("events", "view_event"),
    ("organizations", "view_organization"),
    ("forms", "add_answer"),
    ("forms", "change_answer"),
    ("forms", "view_answer"),
    ("forms", "view_form"),
    ("forms", "add_response"),
    ("events", "add_signup"),
    ("events", "view_signup"),
]

DEFAULT_HR_GROUP_PERMISSIONS: DefaultPermissionsType = [("forms", "manage_form")]
