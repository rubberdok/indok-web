import graphene
from graphene import NonNull

from apps.janhus.mutations import (
    CreateJanHusBooking,
    CreateJanHusBookingRequest,
    CreateJanHusPaymentProduct,
    DeleteJanHusBooking,
    DeleteJanHusBookingRequest,
    ReviewJanHusBooking,
    ReviewJanHusBookingRequest,
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
    JanHusGuestListEntryType,
)


class JanHusMutations(graphene.ObjectType):
    create_janhus_booking = CreateJanHusBooking.Field()
    update_janhus_booking = UpdateJanHusBooking.Field()
    review_janhus_booking = ReviewJanHusBooking.Field()
    delete_janhus_booking = DeleteJanHusBooking.Field()

    create_janhus_booking_request = CreateJanHusBookingRequest.Field()
    review_janhus_booking_request = ReviewJanHusBookingRequest.Field()
    delete_janhus_booking_request = DeleteJanHusBookingRequest.Field()

    update_janhus_booking_settings = UpdateJanHusBookingSettings.Field()
    update_janhus_area_configuration = UpdateJanHusAreaConfiguration.Field()

    create_janhus_payment_product = CreateJanHusPaymentProduct.Field()


class JanHusQueries(graphene.ObjectType, JanHusResolvers):
    janhus_bookings = graphene.List(
        NonNull(JanHusBookingType),
        starts_at=graphene.DateTime(required=False),
        ends_at=graphene.DateTime(required=False),
        area=graphene.String(required=False),
    )
    janhus_my_bookings = graphene.List(NonNull(JanHusBookingType))
    janhus_guest_search = graphene.List(
        NonNull(JanHusGuestListEntryType),
        booking_id=graphene.ID(required=True),
        query=graphene.String(required=True),
        limit=graphene.Int(required=False),
    )
    janhus_guest_search_for_request = graphene.List(
        NonNull(JanHusGuestListEntryType),
        query=graphene.String(required=True),
        limit=graphene.Int(required=False),
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
