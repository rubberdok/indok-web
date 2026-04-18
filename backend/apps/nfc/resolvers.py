from decorators import login_required, permission_required

from .models import NfcAccessEvent, NfcAccessGrant, NfcCard, NfcCardAssignment, normalize_uid_hex


class NfcResolvers:
    @permission_required("nfc.manage_nfc")
    def resolve_nfc_cards(self, info):
        return NfcCard.objects.all().order_by("uid_hex")

    @permission_required("nfc.manage_nfc")
    def resolve_nfc_card(self, info, uid_hex: str):
        normalized_uid = normalize_uid_hex(uid_hex)
        return NfcCard.objects.filter(uid_hex=normalized_uid).first()

    @permission_required("nfc.manage_nfc")
    def resolve_nfc_card_assignments(self, info, active_only: bool = True):
        query = NfcCardAssignment.objects.select_related("card", "user", "assigned_by", "revoked_by")
        if active_only:
            query = query.filter(revoked_at__isnull=True)
        return query.order_by("-assigned_at")

    @login_required
    def resolve_my_nfc_card_assignment(self, info):
        return (
            NfcCardAssignment.objects.select_related("card")
            .filter(user=info.context.user, revoked_at__isnull=True)
            .first()
        )

    @permission_required("nfc.manage_nfc")
    def resolve_nfc_access_grants(self, info, active_only: bool = True):
        query = NfcAccessGrant.objects.select_related("granted_to_user", "granted_to_card", "booking")
        if active_only:
            query = query.filter(revoked_at__isnull=True)
        return query.order_by("-created_at")

    @permission_required("nfc.manage_nfc")
    def resolve_nfc_access_events(self, info, limit: int = 200, door_identifier: str = None):
        query = NfcAccessEvent.objects.select_related("card", "card_assignment", "resolved_user")
        if door_identifier:
            query = query.filter(door_identifier=door_identifier)

        safe_limit = max(1, min(limit, 1000))
        return query.order_by("-occurred_at")[:safe_limit]
