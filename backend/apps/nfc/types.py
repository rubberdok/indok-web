import graphene
from graphene_django import DjangoObjectType

from .models import NfcAccessEvent


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
