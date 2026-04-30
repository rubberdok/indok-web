import graphene
from graphene import NonNull

from apps.janhus.mutations import (
    CreateJanHusBooking,
    CreateJanHusBookingRequest,
    CreateJanHusPaymentProduct,
    MarkJanHusBankIDSigned,
    ReviewJanHusBooking,
    ReviewJanHusBookingRequest,
    StartJanHusBankIDSigning,
    UpdateJanHusAreaConfiguration,
    UpdateJanHusBooking,
    UpdateJanHusBookingSettings,
)
from apps.janhus.resolvers import JanHusResolvers
from apps.janhus.types import (
    JanHusAreaConfigurationType,
    JanHusBookingLevelType,
    JanHusBookingRequestType,
    JanHusBookingSettingsType,
    JanHusBookingType,
)


class JanHusMutations(graphene.ObjectType):
    create_janhus_booking = CreateJanHusBooking.Field()
    update_janhus_booking = UpdateJanHusBooking.Field()
    review_janhus_booking = ReviewJanHusBooking.Field()

    create_janhus_booking_request = CreateJanHusBookingRequest.Field()
    review_janhus_booking_request = ReviewJanHusBookingRequest.Field()

    update_janhus_booking_settings = UpdateJanHusBookingSettings.Field()
    update_janhus_area_configuration = UpdateJanHusAreaConfiguration.Field()

    create_janhus_payment_product = CreateJanHusPaymentProduct.Field()

    start_janhus_bankid_signing = StartJanHusBankIDSigning.Field()
    mark_janhus_bankid_signed = MarkJanHusBankIDSigned.Field()


class JanHusQueries(graphene.ObjectType, JanHusResolvers):
    janhus_bookings = graphene.List(
        NonNull(JanHusBookingType),
        starts_at=graphene.DateTime(required=False),
        ends_at=graphene.DateTime(required=False),
        area=graphene.String(required=False),
    )
    admin_janhus_bookings = graphene.List(
        NonNull(JanHusBookingType),
        status=graphene.String(required=False),
    )

    janhus_booking_settings = graphene.Field(JanHusBookingSettingsType)
    janhus_area_configurations = graphene.List(NonNull(JanHusAreaConfigurationType))

    janhus_booking_levels = graphene.List(NonNull(JanHusBookingLevelType))
    janhus_my_booking_level = graphene.Field(JanHusBookingLevelType)

    janhus_booking_requests = graphene.List(
        NonNull(JanHusBookingRequestType),
        status=graphene.String(required=False),
    )
