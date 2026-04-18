from django.contrib import admin

from .models import NfcAccessEvent, NfcAccessGrant, NfcCard, NfcCardAssignment


@admin.register(NfcCard)
class NfcCardAdmin(admin.ModelAdmin):
    list_display = ("uid_hex", "label", "is_enabled", "created_at", "updated_at")
    search_fields = ("uid_hex", "label")


@admin.register(NfcCardAssignment)
class NfcCardAssignmentAdmin(admin.ModelAdmin):
    list_display = (
        "card",
        "user",
        "external_holder_name",
        "access_start",
        "access_end",
        "permanent_access",
        "revoked_at",
    )
    search_fields = ("card__uid_hex", "user__username", "external_holder_name")
    list_filter = ("permanent_access", "revoked_at")


@admin.register(NfcAccessGrant)
class NfcAccessGrantAdmin(admin.ModelAdmin):
    list_display = (
        "scope",
        "booking",
        "granted_to_user",
        "granted_to_card",
        "participant_policy",
        "access_start",
        "access_end",
        "permanent_access",
        "revoked_at",
    )
    list_filter = ("scope", "participant_policy", "permanent_access", "revoked_at")


@admin.register(NfcAccessEvent)
class NfcAccessEventAdmin(admin.ModelAdmin):
    list_display = ("event_type", "source", "door_identifier", "uid_hex_reported", "occurred_at")
    search_fields = ("door_identifier", "uid_hex_reported", "resolved_user__username")
    list_filter = ("event_type", "source")
