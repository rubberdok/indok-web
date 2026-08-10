from django.contrib import admin

from apps.janhus.models import (
    JanHusAreaConfiguration,
    JanHusBooking,
    JanHusBookingLevel,
    JanHusBookingRequest,
    JanHusBookingSettings,
    JanHusOrganizationBookingLevel,
    JanHusUserBookingLevel,
)


@admin.register(JanHusBooking)
class JanHusBookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "starts_at",
        "ends_at",
        "area",
        "status",
        "owner_user",
        "owner_organization",
        "is_external_booking",
        "event_type",
        "deposit_status",
    )
    list_filter = (
        "area",
        "status",
        "event_type",
        "deposit_status",
        "cleaning_requested",
        "is_external_booking",
    )
    search_fields = (
        "responsible_name",
        "responsible_email",
        "booker_name",
        "booker_email",
        "owner_organization__name",
    )
    raw_id_fields = (
        "owner_user",
        "owner_organization",
        "booking_level",
        "created_by_user",
    )


@admin.register(JanHusBookingRequest)
class JanHusBookingRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "starts_at",
        "ends_at",
        "area",
        "status",
        "requester_user",
        "owner_organization",
        "responsible_name",
    )
    list_filter = ("status", "area", "event_type", "cleaning_requested")
    search_fields = (
        "requester_name",
        "requester_email",
        "responsible_name",
        "responsible_email",
    )
    raw_id_fields = ("requester_user", "owner_organization", "converted_booking")


@admin.register(JanHusBookingLevel)
class JanHusBookingLevelAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "priority",
        "can_book_anytime",
        "can_create_provisional",
        "can_create_confirmed",
        "can_override_lower_levels",
        "can_edit_own_bookings_only",
        "can_edit_all_bookings",
        "booking_opens_weeks_before",
    )
    list_filter = (
        "can_book_anytime",
        "can_create_provisional",
        "can_create_confirmed",
        "can_override_lower_levels",
    )
    search_fields = ("name", "description")


@admin.register(JanHusUserBookingLevel)
class JanHusUserBookingLevelAdmin(admin.ModelAdmin):
    list_display = ("user", "level")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "level__name",
    )
    raw_id_fields = ("user", "level")


@admin.register(JanHusOrganizationBookingLevel)
class JanHusOrganizationBookingLevelAdmin(admin.ModelAdmin):
    list_display = ("organization", "level")
    search_fields = ("organization__name", "level__name")
    raw_id_fields = ("organization", "level")


@admin.register(JanHusBookingSettings)
class JanHusBookingSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "min_duration_minutes",
        "slot_granularity_minutes",
        "opening_hour",
        "closing_hour",
        "buffer_minutes",
        "organization_booking_opens_weeks_before",
        "general_booking_opens_weeks_before",
        "external_bookings_enabled",
    )


@admin.register(JanHusAreaConfiguration)
class JanHusAreaConfigurationAdmin(admin.ModelAdmin):
    list_display = (
        "area",
        "internal_price_per_hour",
        "external_price_per_hour",
        "cleaning_fee",
    )
    list_filter = ("area",)
