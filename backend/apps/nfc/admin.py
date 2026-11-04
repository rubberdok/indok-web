from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models import (
    NfcAccessEvent,
    NfcCard,
    NfcCardAssignment,
    NfcManualAccess,
    NfcPermanentAccessChange,
    NfcSettings,
    NfcUserNote,
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
        "permanent_access_until",
        "assigned_at",
        "revoked_at",
    )
    search_fields = ("card__card_number", "card__mifare_csn", "user__username")
    list_select_related = ("card", "user")
    list_filter = ("permanent_access", "revoked_at")
    raw_id_fields = ("user", "assigned_by", "revoked_by")

    @staticmethod
    def _opens_the_door_at_all_hours(assignment) -> bool:
        return bool(assignment and assignment.permanent_access and assignment.revoked_at is None)

    def _record_change(self, request, assignment, given):
        if assignment.user_id:
            NfcPermanentAccessChange.objects.create(
                user_id=assignment.user_id, changed_by=request.user, given=given, reason="Endret i Django admin"
            )

    def save_model(self, request, obj, form, change):
        before = NfcCardAssignment.objects.filter(pk=obj.pk).first() if change else None
        super().save_model(request, obj, form, change)
        if before and before.user_id != obj.user_id and self._opens_the_door_at_all_hours(before):
            self._record_change(request, before, given=False)
            before = None
        given = self._opens_the_door_at_all_hours(obj)
        if given != self._opens_the_door_at_all_hours(before):
            self._record_change(request, obj, given)
        elif given and before and before.permanent_access_until != obj.permanent_access_until:
            self._record_change(request, obj, True)

    def delete_model(self, request, obj):
        if self._opens_the_door_at_all_hours(obj):
            self._record_change(request, obj, False)
        super().delete_model(request, obj)

    def delete_queryset(self, request, queryset):
        for assignment in queryset.filter(permanent_access=True, revoked_at__isnull=True):
            self._record_change(request, assignment, False)
        super().delete_queryset(request, queryset)


@admin.register(NfcManualAccess)
class NfcManualAccessAdmin(admin.ModelAdmin):
    list_display = ("user", "organization", "organization_people", "starts_at", "ends_at", "removed_at")
    search_fields = ("user__username", "organization__name", "reason")
    list_select_related = ("user", "organization")
    raw_id_fields = ("user", "organization", "created_by", "removed_by")


@admin.register(NfcUserNote)
class NfcUserNoteAdmin(admin.ModelAdmin):
    list_display = ("user", "updated_by", "updated_at")
    list_select_related = ("user", "updated_by")
    raw_id_fields = ("user", "updated_by")
    search_fields = ("user__username",)


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
