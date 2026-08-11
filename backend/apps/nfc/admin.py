from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models import (
    NfcAccessEvent,
    NfcAccessGrant,
    NfcCard,
    NfcCardAssignment,
    NfcSettings,
)


@admin.register(NfcCard)
class NfcCardAdmin(admin.ModelAdmin):
    list_display = ("mifare_csn", "label", "is_enabled", "created_at", "updated_at")
    search_fields = ("mifare_csn", "label")


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
    search_fields = ("card__mifare_csn", "user__username", "external_holder_name")
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
    list_display = (
        "event_type",
        "source",
        "door_identifier",
        "mifare_csn_reported",
        "occurred_at",
    )
    search_fields = ("door_identifier", "mifare_csn_reported", "resolved_user__username")
    list_filter = ("event_type", "source")


@admin.register(NfcSettings)
class NfcSettingsAdmin(admin.ModelAdmin):
    list_display = ("allow_user_mifare_csn_self_service",)

    def has_add_permission(self, request):
        return not NfcSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        settings_obj, _created = NfcSettings.objects.get_or_create(
            pk=NfcSettings.SINGLETON_PK,
            defaults={
                "allow_user_mifare_csn_self_service": True,
            },
        )
        url = reverse("admin:nfc_nfcsettings_change", args=(settings_obj.pk,))
        return HttpResponseRedirect(url)
