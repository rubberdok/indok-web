from apps.users.models import User


def can_manage_user_profiles(user: User) -> bool:
    if not user or not user.is_authenticated:
        return False

    return (
        user.is_staff
        or user.is_superuser
        or user.has_perm("users.manage_user_profiles")
        or user.has_perm("auth.change_user")
    )


def can_manage_user_nfc(user: User) -> bool:
    if not user or not user.is_authenticated:
        return False

    return (
        can_manage_user_profiles(user)
        or user.is_staff
        or user.is_superuser
        or user.has_perm("users.manage_user_nfc")
        or user.has_perm("nfc.manage_nfc")
    )
