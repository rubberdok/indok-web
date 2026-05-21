from apps.users.models import User
from apps.organizations.models import Organization, Membership
from decorators import PermissionDenied
from decorators.constants import PERMISSION_REQUIRED_ERROR
from apps.permissions.constants import HR_TYPE


def check_user_membership(user: User, organization: Organization):
    membership = Membership.objects.filter(user=user, organization=organization)
    if not membership:
        raise PermissionDenied(
            f"{user.username}({user.id}) is not a member of {organization.name}({organization.id})"
        )


def can_manage_memberships(user: User, organization: Organization) -> bool:
    if not user or not user.is_authenticated or not organization:
        return False

    return bool(
        user.is_superuser
        or user.has_perm("organizations.manage_organization")
        or Membership.objects.filter(
            user=user,
            organization=organization,
            group__group_type=HR_TYPE,
        ).exists()
    )


def require_manage_memberships(user: User, organization: Organization) -> None:
    if not can_manage_memberships(user, organization):
        raise PermissionDenied(PERMISSION_REQUIRED_ERROR)
