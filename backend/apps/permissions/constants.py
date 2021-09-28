from typing import Final

DefaultPermissionsType = Final[list[tuple[str, str]]]

ORGANIZATION: Final = "Organization member"
INDOK: Final = "Indøk"
REGISTERED_USER: Final = "Registered user"
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
