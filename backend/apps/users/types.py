import graphene
from graphene import NonNull
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from decorators import login_required, get_resolver_parent, permission_required_or_none
from apps.users.permissions import can_manage_user_nfc

ACTIVE_NFC_ASSIGNMENTS = "active_nfc_assignments"


def with_active_nfc_assignment(users):
    """
    Fetches every user's active card assignment in one query. The four nfc fields
    below each need it, so a user search would otherwise cost four queries per user.
    """
    from django.db.models import Prefetch

    from apps.nfc.models import NfcCardAssignment

    return users.prefetch_related(
        Prefetch(
            "nfc_card_assignments",
            queryset=NfcCardAssignment.objects.filter(revoked_at__isnull=True).select_related("card").order_by("pk"),
            to_attr=ACTIVE_NFC_ASSIGNMENTS,
        )
    )


def active_nfc_assignment(user):
    """The user's active card assignment, looked up at most once per user object."""
    if "_active_nfc_assignment" not in user.__dict__:
        prefetched = getattr(user, ACTIVE_NFC_ASSIGNMENTS, None)
        if prefetched is None:
            from apps.nfc.models import NfcCardAssignment

            prefetched = list(
                NfcCardAssignment.objects.select_related("card")
                .filter(user=user, revoked_at__isnull=True)
                .order_by("pk")[:1]
            )
        user.__dict__["_active_nfc_assignment"] = prefetched[0] if prefetched else None
    return user.__dict__["_active_nfc_assignment"]


class NfcPermanentAccessChangeType(graphene.ObjectType):
    """One change of someone's permanent door access."""

    given = graphene.Boolean(required=True, description="True if access was given, False if it was removed.")
    changed_at = graphene.DateTime(required=True)
    changed_by = graphene.String(description="The name of the person who made the change.")
    reason = graphene.String(required=True)

    @staticmethod
    def resolve_changed_by(change, info):
        return change.changed_by.get_full_name() if change.changed_by else None


class UserType(DjangoObjectType):
    grade_year = graphene.Int(source="grade_year")
    events = graphene.List(NonNull("apps.events.types.EventType"), source="events")
    allergies = graphene.String(required=False)
    can_update_year = graphene.Boolean()
    nfc_mifare_csn = graphene.String(
        description="The number the door reads (10 digits). For admins and troubleshooting."
    )
    nfc_card_number = graphene.String(
        description="The card number as it appears on the user's card. Show this to the user."
    )
    nfc_permanent_access = graphene.Boolean()
    nfc_has_pin = graphene.Boolean(description="Whether a door PIN is set. The PIN itself is never returned.")
    nfc_permanent_access_status = graphene.String(
        description="ACTIVE, NOT_GRANTED, INACTIVE_USER, ENDED, CARD_DISABLED or NO_PIN. For door access admins."
    )
    nfc_permanent_access_ends = graphene.DateTime(description="Date when permanent access ends.")
    nfc_permanent_access_history = graphene.List(NonNull(NfcPermanentAccessChangeType), description="Newest first.")
    nfc_note = graphene.String(description="Why this person has permanent access.")
    nfc_note_updated_at = graphene.DateTime()
    nfc_note_updated_by = graphene.String(description="The name of the person who last changed the note.")

    class Meta:
        model = get_user_model()

        fields = [
            "id",
            "last_login",
            "username",
            "first_name",
            "last_name",
            "email",
            "date_joined",
            "feide_userid",
            "feide_email",
            "is_indok",
            "id_token",
            "phone_number",
            "first_login",
            "graduation_year",
            "memberships",
            "events",
            "organizations",
            "responses",
            "year_updated_at",
        ]

    @staticmethod
    def resolve_responses(parent, info):
        return parent.responses.all() if info.context.user.pk == parent.pk else parent.responses.none()

    @staticmethod
    def resolve_id_token(parent, info):
        return parent.id_token if info.context.user.pk == parent.pk else ""

    @staticmethod
    @login_required
    @permission_required_or_none("users.view_sensitive_info", fn=get_resolver_parent)
    def resolve_allergies(parent, info):
        return parent.allergies

    @staticmethod
    def resolve_can_update_year(parent, info):
        return parent.can_update_year

    @staticmethod
    @login_required
    def resolve_nfc_mifare_csn(parent, info):
        if info.context.user.pk != parent.pk and not can_manage_user_nfc(info.context.user):
            return None

        active_assignment = active_nfc_assignment(parent)
        return active_assignment.card.mifare_csn if active_assignment else None

    @staticmethod
    @login_required
    def resolve_nfc_card_number(parent, info):
        if info.context.user.pk != parent.pk and not can_manage_user_nfc(info.context.user):
            return None

        active_assignment = active_nfc_assignment(parent)
        return active_assignment.card.number_for_display if active_assignment else None

    @staticmethod
    @login_required
    def resolve_nfc_permanent_access(parent, info):
        if info.context.user.pk != parent.pk and not can_manage_user_nfc(info.context.user):
            return None

        active_assignment = active_nfc_assignment(parent)
        return active_assignment.permanent_access if active_assignment else False

    @staticmethod
    @login_required
    def resolve_nfc_has_pin(parent, info):
        if info.context.user.pk != parent.pk and not can_manage_user_nfc(info.context.user):
            return None

        active_assignment = active_nfc_assignment(parent)
        return active_assignment.has_pin if active_assignment else False

    @staticmethod
    @login_required
    def resolve_nfc_permanent_access_status(parent, info):
        if not can_manage_user_nfc(info.context.user):
            return None

        from apps.nfc.models import permanent_access_status

        return permanent_access_status(parent, active_nfc_assignment(parent))

    @staticmethod
    @login_required
    def resolve_nfc_permanent_access_ends(parent, info):
        if not can_manage_user_nfc(info.context.user):
            return None

        from apps.nfc.models import permanent_access_ends

        return permanent_access_ends(parent.graduation_year)

    @staticmethod
    @login_required
    def resolve_nfc_permanent_access_history(parent, info):
        if not can_manage_user_nfc(info.context.user):
            return None

        return parent.nfc_permanent_access_changes.select_related("changed_by")

    @staticmethod
    @login_required
    def resolve_nfc_note(parent, info):
        if not can_manage_user_nfc(info.context.user):
            return None

        note = getattr(parent, "nfc_note", None)
        return note.note if note else None

    @staticmethod
    @login_required
    def resolve_nfc_note_updated_at(parent, info):
        if not can_manage_user_nfc(info.context.user):
            return None

        note = getattr(parent, "nfc_note", None)
        return note.updated_at if note else None

    @staticmethod
    @login_required
    def resolve_nfc_note_updated_by(parent, info):
        if not can_manage_user_nfc(info.context.user):
            return None

        note = getattr(parent, "nfc_note", None)
        return note.updated_by.get_full_name() if note and note.updated_by else None
