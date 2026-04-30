import graphene
from graphene_django import DjangoObjectType

from apps.janhus.models import (
    JanHusAreaConfiguration,
    JanHusBooking,
    JanHusBookingLevel,
    JanHusBookingRequest,
    JanHusBookingSettings,
    JanHusOrganizationBookingLevel,
    JanHusUserBookingLevel,
)


class JanHusBookingType(DjangoObjectType):
    total_price = graphene.Decimal(source="total_price")
    duration_minutes = graphene.Int(source="duration_minutes")

    class Meta:
        model = JanHusBooking


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


class JanHusBankIDSigningStubType(graphene.ObjectType):
    provider = graphene.String(required=True)
    reference = graphene.String(required=True)
    signing_url = graphene.String(required=True)
