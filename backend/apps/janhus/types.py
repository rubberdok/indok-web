import graphene
from graphene_django import DjangoObjectType

from apps.janhus.guest_list import build_guest_list_entries
from apps.janhus.models import (
    JanHusAreaConfiguration,
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


class JanHusBookingType(DjangoObjectType):
    total_price = graphene.Decimal(source="total_price")
    duration_minutes = graphene.Int(source="duration_minutes")
    outstanding_deposit_amount = graphene.Decimal(source="outstanding_deposit_amount")
    guest_list_entries = graphene.List(graphene.NonNull(JanHusGuestListEntryType))

    class Meta:
        model = JanHusBooking

    @staticmethod
    def resolve_guest_list_entries(parent, info):
        return build_guest_list_entries(parent.guest_list)


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


class JanHusAreaConfigurationType(DjangoObjectType):
    class Meta:
        model = JanHusAreaConfiguration
