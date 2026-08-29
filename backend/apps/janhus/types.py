import graphene
from decorators import PermissionDenied
from graphene_django import DjangoObjectType

from apps.janhus.guest_list import build_guest_list_entries
from apps.janhus.permissions import can_view_booking_details
from apps.janhus.models import (
    JanHusArea,
    JanHusBooking,
    JanHusBookingLevel,
    JanHusBookingRequest,
    JanHusBookingSettings,
    JanHusOrganizationBookingLevel,
    JanHusUserBookingLevel,
)


class JanHusGuestListEntryType(graphene.ObjectType):
    feide_userid = graphene.String(required=True)
    display_name = graphene.String(required=True)


PROTECTED_BOOKING_FIELDS = [
    "reference",
    "booker_name",
    "booker_email",
    "booker_phone",
    "responsible_name",
    "responsible_email",
    "responsible_phone",
    "guest_list",
    "comment",
    "admin_comment",
    "owner_user",
    "owner_organization",
    "deposit_amount",
    "price_override_amount",
    "price_override_tier",
    "manually_marked_as_paid",
    "vipps_product",
    "vipps_order",
]


def _protected_booking_field_resolver(field_name):
    @staticmethod
    def resolver(parent: JanHusBooking, info):
        if not can_view_booking_details(info.context.user, parent):
            raise PermissionDenied(
                "Du har ikke tilgang til detaljene for denne bookingen"
            )
        return getattr(parent, field_name)

    return resolver


class JanHusBookingType(DjangoObjectType):
    total_price = graphene.Decimal(source="total_price")
    duration_minutes = graphene.Int(source="duration_minutes")
    outstanding_deposit_amount = graphene.Decimal(source="outstanding_deposit_amount")
    guest_list_entries = graphene.List(graphene.NonNull(JanHusGuestListEntryType))

    class Meta:
        model = JanHusBooking

    @staticmethod
    def resolve_guest_list_entries(parent, info):
        if not can_view_booking_details(info.context.user, parent):
            raise PermissionDenied(
                "Du har ikke tilgang til detaljene for denne bookingen"
            )
        return build_guest_list_entries(parent.guest_list)

    @staticmethod
    def resolve_total_price(parent: JanHusBooking, info):
        if not can_view_booking_details(info.context.user, parent):
            raise PermissionDenied(
                "Du har ikke tilgang til detaljene for denne bookingen"
            )
        return parent.total_price

    @staticmethod
    def resolve_outstanding_deposit_amount(parent: JanHusBooking, info):
        if not can_view_booking_details(info.context.user, parent):
            raise PermissionDenied(
                "Du har ikke tilgang til detaljene for denne bookingen"
            )
        return parent.outstanding_deposit_amount


for _field_name in PROTECTED_BOOKING_FIELDS:
    setattr(
        JanHusBookingType,
        f"resolve_{_field_name}",
        _protected_booking_field_resolver(_field_name),
    )


class JanHusBookingRequestType(DjangoObjectType):
    class Meta:
        model = JanHusBookingRequest


class JanHusBookingLevelType(DjangoObjectType):
    class Meta:
        model = JanHusBookingLevel


class JanHusUserBookingLevelType(DjangoObjectType):
    class Meta:
        model = JanHusUserBookingLevel


class JanHusOrganizationBookingLevelType(DjangoObjectType):
    class Meta:
        model = JanHusOrganizationBookingLevel


class JanHusBookingSettingsType(DjangoObjectType):
    class Meta:
        model = JanHusBookingSettings
        exclude = ("booking_contact_email",)


class JanHusAreaType(DjangoObjectType):
    conflicting_area_ids = graphene.List(graphene.NonNull(graphene.ID))

    class Meta:
        model = JanHusArea

    @staticmethod
    def resolve_conflicting_area_ids(parent: JanHusArea, info):
        return parent.conflicting_area_ids
