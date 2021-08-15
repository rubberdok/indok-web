from typing import Final


ORGANIZATION: Final = "Organization member"
INDOK: Final = "Indøk"

DEFAULT_ORGANIZATION_PERMISSIONS: Final = [
    ("events", "add_event"),
    ("events", "change_event"),
    ("events", "delete_event"),
    ("listings" "add_listing"),
    ("listings", "change_listing"),
    ("listings", "delete_listing"),
    ("organizations", "add_membership"),
]

DEFAULT_INDOK_PERMISSIONS: Final = [
    ("listings", "view_listing"),
    ("events", "view_event"),
    ("organizations", "view_organization"),
    ("forms", "add_answer"),
    ("forms", "change_answer"),
    ("forms", "view_answer"),
    ("forms", "add_response"),
    ("events", "add_sign_up"),
    ("events", "view_sign_up"),
]
