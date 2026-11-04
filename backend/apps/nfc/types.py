import graphene
from graphene import NonNull
from graphene_django import DjangoObjectType

from .models import NfcAccessEvent, NfcManualAccess


def external_holder(event: NfcAccessEvent):
    """The external card holder (apps.arx) of the event's card, if the card is one."""
    card = event.card
    return getattr(card, "external_holder", None) if card is not None else None


class DoorLogEventType(DjangoObjectType):
    """One door event imported from ARX, for the door log page."""

    name = graphene.String(
        description="The website user's name, or the name ARX has when the card is not registered on the website."
    )
    is_website_user = graphene.Boolean(required=True)
    holder_kind = graphene.String(
        required=True,
        description=(
            "USER: a card registered to a website user. EXTERNAL_CARD: an external card from Django admin. "
            "ARX_ONLY: a card the website does not know; the name is the one ARX has."
        ),
    )
    card_format = graphene.String()
    arx_event = graphene.String(description="The event name in ARX, e.g. controller.access.card.valid.pin")

    class Meta:
        model = NfcAccessEvent
        fields = [
            "id",
            "event_type",
            "door_identifier",
            "mifare_csn_reported",
            "person_name",
            "occurred_at",
        ]

    @staticmethod
    def resolve_name(event: NfcAccessEvent, info):
        user = event.resolved_user
        if user is not None:
            return user.get_full_name() or user.username
        holder = external_holder(event)
        if holder is not None:
            return holder.name
        return event.person_name or None

    @staticmethod
    def resolve_holder_kind(event: NfcAccessEvent, info):
        if event.resolved_user_id is not None:
            return "USER"
        return "EXTERNAL_CARD" if external_holder(event) is not None else "ARX_ONLY"

    @staticmethod
    def resolve_is_website_user(event: NfcAccessEvent, info):
        return event.resolved_user_id is not None

    @staticmethod
    def resolve_card_format(event: NfcAccessEvent, info):
        return (event.raw_payload or {}).get("card_format") or None

    @staticmethod
    def resolve_arx_event(event: NfcAccessEvent, info):
        return (event.raw_payload or {}).get("name") or None


class DoorLogPage(graphene.ObjectType):
    total = graphene.Int(required=True)
    events = graphene.List(graphene.NonNull(DoorLogEventType), required=True)


class NfcAccessPeriodType(graphene.ObjectType):
    kind = graphene.String(required=True, description="PERMANENT, TEMPORARY, BOOKING, MANUAL or EXTERNAL")
    starts_at = graphene.DateTime(description="Empty when not known, for access given before this was recorded.")
    ends_at = graphene.DateTime(description="Empty when it does not end by itself.")
    detail = graphene.String(required=True)


class NfcDoorAccessPersonType(graphene.ObjectType):
    key = graphene.String(required=True)
    user = graphene.Field("apps.users.types.UserType", description="Empty for an external card.")
    holder_name = graphene.String(required=True)
    card_number = graphene.String(required=True)
    state = graphene.String(required=True, description="NOW, UPCOMING, PAST or NOTE_ONLY")
    blocked_reason = graphene.String(
        required=True,
        description="Why door access is blocked: INACTIVE_USER, NO_CARD, CARD_DISABLED, NO_PIN or CARD_AMBIGUOUS.",
    )
    periods = graphene.List(NonNull(NfcAccessPeriodType), required=True)


class NfcDoorAccessOverviewType(graphene.ObjectType):
    people = graphene.List(NonNull(NfcDoorAccessPersonType), required=True)
    past_days = graphene.Int(required=True)
    max_past_days = graphene.Int(required=True, description="How long door events are kept (ARX settings).")
    areas_connected = graphene.Boolean(required=True, description="Whether any JanHus area opens a door in ARX.")


class NfcManualAccessType(DjangoObjectType):
    target_name = graphene.String(required=True)
    people_count = graphene.Int(required=True, description="How many people this gives access to now.")
    created_by_name = graphene.String()
    is_organization = graphene.Boolean(required=True)

    class Meta:
        model = NfcManualAccess
        fields = ["id", "organization_people", "starts_at", "ends_at", "reason", "created_at"]

    @staticmethod
    def resolve_is_organization(access: NfcManualAccess, info):
        return access.organization_id is not None

    @staticmethod
    def resolve_target_name(access: NfcManualAccess, info):
        if access.user_id:
            return access.user.get_full_name() or access.user.username
        return access.organization.name

    @staticmethod
    def resolve_people_count(access: NfcManualAccess, info):
        counted = getattr(access, "people_count", None)
        if counted is not None:
            return counted
        from apps.arx.services import manual_access_people

        return len(manual_access_people([access])[access.pk])

    @staticmethod
    def resolve_created_by_name(access: NfcManualAccess, info):
        return access.created_by.get_full_name() if access.created_by else None
