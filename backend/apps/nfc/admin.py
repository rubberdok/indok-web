from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models import (
    NfcAccessEvent,
    NfcCard,
    NfcCardAssignment,
    NfcSettings,
)


@admin.register(NfcCard)
class NfcCardAdmin(admin.ModelAdmin):
    list_display = ("card_number", "mifare_csn", "label", "is_enabled", "created_at", "updated_at")
    search_fields = ("card_number", "mifare_csn", "label")


@admin.register(NfcCardAssignment)
class NfcCardAssignmentAdmin(admin.ModelAdmin):
    list_display = (
        "card",
        "user",
        "has_pin",
        "permanent_access",
        "assigned_at",
        "revoked_at",
    )
    search_fields = ("card__card_number", "card__mifare_csn", "user__username")
    list_select_related = ("card", "user")  # one query for the list, not two per row
    list_filter = ("permanent_access", "revoked_at")
    raw_id_fields = ("user", "assigned_by", "revoked_by")


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
    raw_id_fields = ("resolved_user",)


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
