from decorators import login_required, staff_member_required
from django.contrib.auth import get_user_model, logout
from django.db.models import Q

from .permissions import can_manage_user_nfc, can_manage_user_profiles


class UserResolvers:
    def resolve_user(self, info):
        if isinstance(info.context.user, get_user_model()) and not info.context.user.is_anonymous:
            return info.context.user
        else:
            return None

    @staff_member_required
    def resolve_all_users(self, info):
        return get_user_model().objects.all()

    @login_required
    def resolve_user_search(self, info, query: str, limit: int = 25):
        user = info.context.user
        if not can_manage_user_profiles(user):
            raise PermissionError("Du har ikke tilgang til å søke i brukere")

        return _search_users(query=query, limit=limit)

    @login_required
    def resolve_nfc_user_search(self, info, query: str, limit: int = 25):
        user = info.context.user
        if not can_manage_user_nfc(user):
            raise PermissionError("Du har ikke tilgang til å søke brukere for NFC-redigering")

        return _search_users(query=query, limit=limit)

    @login_required
    def resolve_can_manage_user_profiles(self, info):
        return can_manage_user_profiles(info.context.user)

    @login_required
    def resolve_can_manage_user_nfc(self, info):
        return can_manage_user_nfc(info.context.user)

    def resolve_logout(self, info):
        user = info.context.user
        logout(info.context)
        return user.id_token


def _search_users(query: str, limit: int = 25):
    normalized_query = (query or "").strip()
    if not normalized_query:
        return []

    safe_limit = max(1, min(limit or 25, 100))

    q = (
        Q(username__icontains=normalized_query)
        | Q(first_name__icontains=normalized_query)
        | Q(last_name__icontains=normalized_query)
        | Q(email__icontains=normalized_query)
        | Q(feide_email__icontains=normalized_query)
        | Q(feide_userid__icontains=normalized_query)
        | Q(phone_number__icontains=normalized_query)
    )

    if normalized_query.isdigit():
        q |= Q(pk=int(normalized_query))

    name_parts = normalized_query.split()
    if len(name_parts) >= 2:
        first = name_parts[0]
        last = " ".join(name_parts[1:])
        q |= Q(first_name__icontains=first, last_name__icontains=last)

    return get_user_model().objects.filter(q).distinct().order_by("first_name", "last_name", "username")[:safe_limit]
