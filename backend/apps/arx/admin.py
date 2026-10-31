import re

from django import forms
from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.utils import timezone

from apps.nfc.models import (
    NfcCard,
    NfcCardAssignment,
    display_card_number,
    normalize_card_identifier,
    validate_card_identifier,
)

from .models import (
    APPROVE_TAKEOVER_PERMISSION,
    MANAGE_EXTERNAL_CARDS_PERMISSION,
    ArxAreaMapping,
    ArxPersonSync,
    ArxSettings,
    ExternalBookingAccess,
    ExternalCardHolder,
)


class SuperuserChangesOnly:
    """
    Only superusers change these: they decide which doors open, for how long, and
    who may call the runner API. Staff with the model's view permission may look.
    """

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or super().has_view_permission(request, obj)

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(ArxSettings)
class ArxSettingsAdmin(SuperuserChangesOnly, admin.ModelAdmin):
    readonly_fields = (
        "sync_enabled_at",
        "runner_last_seen_at",
        "runner_last_ok_at",
        "runner_last_error",
        "alert_stage",
        "alert_sent_at",
        "card_digits_warning",
        "card_digits_warning_at",
    )
    fieldsets = (
        (
            "Sync",
            {
                "fields": (
                    "sync_enabled",
                    "sync_enabled_at",
                    "runner_last_seen_at",
                    "runner_last_ok_at",
                    "runner_last_error",
                )
            },
        ),
        (
            "Email when the sync stops",
            {
                "fields": ("alert_stage", "alert_sent_at"),
                "description": (
                    "To the booking contact email in the JanHus booking settings, and to kontakt@rubberdok.no: "
                    "after 24 hours without a good sync, once more after 72 hours, and when it works again "
                    "(three good syncs in a row). The clock starts at the last good sync, or when sync was "
                    "switched on if that is later."
                ),
            },
        ),
        ("Access windows", {"fields": ("buffer_before_minutes", "buffer_after_minutes", "horizon_days")}),
        ("Door events", {"fields": ("event_retention_days",)}),
        (
            "Cards",
            {
                "fields": (
                    "card_format_classic",
                    "card_format_desfire",
                    "card_number_digits",
                    "card_digits_warning",
                    "card_digits_warning_at",
                )
            },
        ),
        ("Runner API", {"fields": ("runner_allowed_ips", "trust_x_forwarded_for")}),
    )

    def has_add_permission(self, request):
        return request.user.is_superuser and not ArxSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ArxAreaMapping)
class ArxAreaMappingAdmin(SuperuserChangesOnly, admin.ModelAdmin):
    list_display = ("area", "grants_access", "arx_category_id")
    list_filter = ("grants_access",)


class ManageExternalCards:
    """Everything about external cards needs one permission, so it can later be given to a group."""

    def _allowed(self, request):
        return request.user.has_perm(MANAGE_EXTERNAL_CARDS_PERMISSION)

    def has_module_permission(self, request):
        return self._allowed(request) or super().has_module_permission(request)

    def has_view_permission(self, request, obj=None):
        return self._allowed(request)

    def has_add_permission(self, request, obj=None):
        return self._allowed(request)

    def has_change_permission(self, request, obj=None):
        return self._allowed(request)

    def has_delete_permission(self, request, obj=None):
        return self._allowed(request)


class ExternalCardHolderForm(forms.ModelForm):
    card_number_input = forms.CharField(
        label="Kortnummer",
        help_text=(
            "Tallene på kortet: 15–17 sifre etter «UID» på nye kort, 10 sifre etter «mS» eller «M» på eldre kort."
        ),
    )
    pin = forms.CharField(
        label="PIN-kode",
        required=False,
        widget=forms.PasswordInput(render_value=False),
        help_text="4 sifre. Vises aldri igjen. La feltet stå tomt for å beholde PIN-koden som er lagret.",
    )

    class Meta:
        model = ExternalCardHolder
        fields = ("name", "notes")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields["card_number_input"].initial = self.instance.card.number_for_display

    def clean_card_number_input(self):
        digits = display_card_number(self.cleaned_data["card_number_input"])
        door_number = normalize_card_identifier(digits)
        validate_card_identifier(door_number)  # the same rule and message as on the website
        card = NfcCard.objects.filter(mifare_csn=door_number).first()
        if card is not None:
            other = ExternalCardHolder.objects.filter(card=card).exclude(pk=self.instance.pk).first()
            if other is not None:
                raise ValidationError(f"Kortet er allerede registrert som eksternt kort for {other.name}.")
            if NfcCardAssignment.objects.filter(card=card, revoked_at__isnull=True).exists():
                raise ValidationError("Kortet er registrert på en bruker på nettsiden.")
        self._card, self._digits, self._door_number = card, digits, door_number
        return digits

    def clean_pin(self):
        pin = (self.cleaned_data.get("pin") or "").strip()
        if pin and not re.fullmatch(r"[0-9]{4}", pin):
            raise ValidationError("PIN-koden må være nøyaktig 4 sifre.")
        if not pin and not (self.instance.pk and self.instance.has_pin):
            raise ValidationError("Et nytt eksternt kort trenger en PIN-kode: døren krever kort og PIN.")
        return pin

    def save(self, commit=True):
        holder = super().save(commit=False)
        card = self._card
        if card is None:
            card = NfcCard(mifare_csn=self._door_number)
        if len(self._digits) > 10:  # the printed UID: kept so the number matches the card
            card.card_number = self._digits
        card.label = f"{holder.name} (eksternt kort)"
        card.save()
        holder.card = card
        if self.cleaned_data.get("pin"):
            holder.pin_code = self.cleaned_data["pin"]
        if commit:
            holder.save()
        return holder


class ExternalBookingAccessInline(ManageExternalCards, admin.TabularInline):
    model = ExternalBookingAccess
    extra = 1
    raw_id_fields = ("booking",)
    fields = ("booking", "booking_summary", "added_by", "added_at")
    readonly_fields = ("booking_summary", "added_by", "added_at")
    verbose_name = "booking with door access"
    verbose_name_plural = "bookings with door access"

    @admin.display(description="Booking")
    def booking_summary(self, obj):
        b = obj.booking if obj.booking_id else None
        if b is None:
            return ""
        start, end = timezone.localtime(b.starts_at), timezone.localtime(b.ends_at)
        return f"{b.reference} · {start:%d.%m.%Y %H:%M}–{end:%H:%M} · {b.area} · {b.get_status_display()}"


@admin.register(ExternalCardHolder)
class ExternalCardHolderAdmin(ManageExternalCards, admin.ModelAdmin):
    """
    An external card opens the door only during the bookings listed below it,
    with the usual buffers and only if the booking is confirmed. The PIN is
    write-only: it is stored encrypted and never shown again.
    """

    form = ExternalCardHolderForm
    inlines = (ExternalBookingAccessInline,)
    list_display = ("name", "card_display", "has_pin_display", "booking_count", "created_at")
    search_fields = ("name", "card__card_number", "card__mifare_csn")
    readonly_fields = ("created_by", "created_at")

    @admin.display(description="Kortnummer")
    def card_display(self, obj):
        return obj.card.number_for_display

    @admin.display(description="PIN satt", boolean=True)
    def has_pin_display(self, obj):
        return obj.has_pin

    @admin.display(description="Bookinger")
    def booking_count(self, obj):
        return obj.booking_access.count()

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
        if change and form.cleaned_data.get("pin"):
            self.log_change(request, obj, "PIN-kode endret")  # the history says it changed, never to what

    def save_formset(self, request, form, formset, change):
        for access in formset.save(commit=False):
            if access.added_by_id is None:
                access.added_by = request.user
            access.save()
        for removed in formset.deleted_objects:
            removed.delete()
        formset.save_m2m()


class CardConflictFilter(admin.SimpleListFilter):
    title = "kortkonflikt"
    parameter_name = "conflict"

    def lookups(self, request, model_admin):
        return (("waiting", "Venter på godkjenning"), ("approved", "Overtakelse godkjent"))

    def queryset(self, request, queryset):
        if self.value() == "waiting":
            return queryset.exclude(conflict_arx_person_id="")
        if self.value() == "approved":
            return queryset.exclude(takeover_from_arx_person_id="")
        return queryset


@admin.register(ArxPersonSync)
class ArxPersonSyncAdmin(admin.ModelAdmin):
    """
    Sync status, read-only except for the card takeover actions. No card numbers
    or PINs are stored here.

    Card conflict: a user registered a card that belongs to a person created by
    hand in ARX. Compare the two names; if they are the same person, approve the
    takeover and the next sync moves the card to the website user. That ARX
    person keeps whatever else it has in ARX, but no longer this card.

    The takeover actions need arx.approve_card_takeover, which nobody has by default
    (superusers have every permission). The rows themselves are the sync's own
    bookkeeping: only superusers change or delete them.
    """

    list_display = (
        "external_id",
        "website_name",
        "conflict_arx_person_name",
        "status",
        "last_error",
        "takeover_from_arx_person_id",
        "synced_at",
    )
    list_filter = ("status", CardConflictFilter)
    search_fields = (
        "external_id",
        "user__first_name",
        "user__last_name",
        "external_holder__name",
        "conflict_arx_person_name",
        "conflict_arx_person_id",
    )
    readonly_fields = ["website_name"] + [f.name for f in ArxPersonSync._meta.fields]
    actions = ("approve_takeover", "withdraw_takeover", "retry_sync")

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user", "external_holder__card")

    def has_add_permission(self, request):
        return False

    def has_approve_card_takeover_permission(self, request):
        return request.user.has_perm(APPROVE_TAKEOVER_PERMISSION)

    def has_module_permission(self, request):
        return super().has_module_permission(request) or self.has_approve_card_takeover_permission(request)

    def has_view_permission(self, request, obj=None):
        return super().has_view_permission(request, obj) or self.has_approve_card_takeover_permission(request)

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    @admin.display(description="Navn på nettsiden")
    def website_name(self, obj):
        if obj.user:
            return obj.user.get_full_name()
        if obj.external_holder:
            return f"{obj.external_holder.name} (eksternt kort)"
        return "(slettet)"

    @admin.action(
        description="Godkjenn: flytt kortet fra ARX-personen til brukeren på nettsiden",
        permissions=["approve_card_takeover"],
    )
    def approve_takeover(self, request, queryset):
        now = timezone.now()
        approved = 0
        for row in queryset.select_related("user", "external_holder__card"):
            if not row.conflict_arx_person_id:
                continue
            if row.user is not None:
                assignment = NfcCardAssignment.objects.filter(user=row.user, revoked_at__isnull=True).first()
                card = assignment.card if assignment else None
            else:
                card = row.external_holder.card if row.external_holder else None
            if card is None:
                continue
            arx_name = row.conflict_arx_person_name
            row.takeover_from_arx_person_id = row.conflict_arx_person_id
            row.takeover_card = card
            row.takeover_approved_by = request.user
            row.takeover_approved_at = now
            row.conflict_hash = ""  # the approval changes the state, so it is sent again
            row.status = ArxPersonSync.Status.PENDING
            row.save()
            self.log_change(
                request,
                row,
                f"Godkjente overtakelse av kort fra ARX-person {row.takeover_from_arx_person_id} "
                f"({arx_name}) til {self.website_name(row)}",
            )
            approved += 1
        skipped = queryset.count() - approved
        self.message_user(request, f"{approved} overtakelse(r) godkjent, {skipped} uten kortkonflikt hoppet over.")

    @admin.action(description="Trekk tilbake godkjent overtakelse", permissions=["approve_card_takeover"])
    def withdraw_takeover(self, request, queryset):
        """Stops future takeovers. A card already moved stays with the website user."""
        rows = list(queryset.exclude(takeover_from_arx_person_id=""))
        for row in rows:
            self.log_change(request, row, f"Trakk tilbake overtakelse fra ARX-person {row.takeover_from_arx_person_id}")
            row.takeover_from_arx_person_id = ""
            row.takeover_card = None
            row.takeover_approved_by = None
            row.takeover_approved_at = None
            row.save()
        self.message_user(request, f"{len(rows)} godkjenning(er) trukket tilbake.", messages.WARNING)

    @admin.action(description="Prøv synkronisering på nytt", permissions=["approve_card_takeover"])
    def retry_sync(self, request, queryset):
        """For a conflict an admin solved by hand in ARX (for example by removing the card there)."""
        n = queryset.exclude(conflict_hash="").update(conflict_hash="")
        self.message_user(request, f"{n} sendes på nytt ved neste kjøring.")
