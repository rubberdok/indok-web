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
    """
    Class for configuring default permission groups for organizations.

    - `name` is the name of the permission group as displayed to organization members.
    - `create_description` is a lambda function that takes the organization's name, and optionally
    uses it in the description of the instance of this permission group on that organization.
    - `permissions` is a two-dimensional dictionary that sets the group's permissions. The first
    level specifices the app, the second specifices the model, and the third specifices the set of
    permissions on that app and model which the permission group should have.
        - The set of permissions must correspond to default model permissions (`add_`, `change_`,
        `delete_`, `view_`), or ones defined in the model's `Meta.permissions`.
    """

    name: str
    create_description: Callable[[str], str]
    permissions: dict[str, dict[str, list[str]]] = field(default_factory=dict)

    def formattedPermissions(self) -> list[str]:
        """Returns the group's permissions in Django's 'app.permission' format."""
        perms = []
        for app in self.permissions:
            for model in app:
                for perm in model:
                    perms.append(perm)
        return perms


ORG_MEMBER_GROUP_TYPE: Final[str] = "ORG_MEMBER"

# Default organization permission groups.
# All organizations will have ResponsibleGroups with these names and descriptions,
# though they may customize their given permissions.
# The given permissions apply only to objects tied to that organization.
DEFAULT_ORG_PERMISSION_GROUPS: Final[dict[str, OrgPermissionGroup]] = {
    ORG_MEMBER_GROUP_TYPE: OrgPermissionGroup(
        name="Medlem",
        create_description=(lambda org_name: f"Medlemmer av {org_name}."),
    ),
    "ORG_ADMIN": OrgPermissionGroup(
        name="Administrator",
        create_description=(
            lambda org_name: f"Administrator av {org_name}. "
            + "Tillatelser til å endre info om foreningen, samt styre medlemmer og deres tillatelser."
        ),
        permissions={
            "organizations": {
                "Organization": [
                    "change_organization",
                    "add_membership",
                ],
                "Membership": [
                    "change_membership",
                    "delete_membership",
                    "view_membership",
                ],
            },
        },
    ),
    "LISTINGS_ADMIN": OrgPermissionGroup(
        name="Vervansvarlig",
        create_description=(
            lambda org_name: f"Vervansvarlige for {org_name}. "
            + "Tillatelser til å lage og redigere verv, samt se og behandle søknader."
        ),
        permissions={
            "organizations": {
                "Organization": [
                    "add_listing",
                    "add_form",
                ],
            },
            "listings": {
                "Listing": [
                    "change_listing",
                    "delete_listing",
                ],
            },
            "forms": {
                "Form": [
                    "manage_form",
                    "change_form",
                    "delete_form",
                ],
            },
        },
    ),
    "EVENTS_ADMIN": OrgPermissionGroup(
        name="Arrangementansvarlig",
        create_description=(
            lambda org_name: f"Arrangementansvarlige for {org_name}. "
            + "Tillatelser til å lage og redigere arrangementer."
        ),
        permissions={
            "organizations": {
                "Organization": [
                    "add_event",
                ],
            },
            "events": {
                "Event": [
                    "change_event",
                    "delete_event",
                ],
            },
        },
    ),
}
