import graphene
from graphene import NonNull

from apps.janhus.mutations import (
    CreateJanHusArea,
    CreateJanHusBooking,
    CreateJanHusBookingRequest,
    CreateJanHusPaymentProduct,
    DeleteJanHusArea,
    DeleteJanHusBooking,
    DeleteJanHusBookingRequest,
    ReviewJanHusBooking,
    ReviewJanHusBookingRequest,
    UpdateJanHusArea,
    UpdateJanHusBooking,
    UpdateJanHusBookingSettings,
)
from apps.janhus.resolvers import JanHusResolvers
from apps.organizations.types import OrganizationType
from apps.janhus.types import (
    JanHusAreaType,
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
    create_janhus_area = CreateJanHusArea.Field()
    update_janhus_area = UpdateJanHusArea.Field()
    delete_janhus_area = DeleteJanHusArea.Field()

    create_janhus_payment_product = CreateJanHusPaymentProduct.Field()


class JanHusQueries(graphene.ObjectType, JanHusResolvers):
    janhus_bookings = graphene.List(
        NonNull(JanHusBookingType),
        starts_at=graphene.DateTime(required=False),
        ends_at=graphene.DateTime(required=False),
        area=graphene.ID(required=False),
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

    janhus_bookable_organizations = graphene.List(NonNull(OrganizationType))

    janhus_booking_settings = graphene.Field(JanHusBookingSettingsType)
    janhus_areas = graphene.List(
        NonNull(JanHusAreaType), include_inactive=graphene.Boolean(required=False)
    )

    janhus_booking_levels = graphene.List(NonNull(JanHusBookingLevelType))
    janhus_my_booking_level = graphene.Field(JanHusBookingLevelType)

    janhus_booking_requests = graphene.List(
        NonNull(JanHusBookingRequestType),
        status=graphene.String(required=False),
    )
