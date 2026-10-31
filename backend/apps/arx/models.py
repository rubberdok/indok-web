import ipaddress

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone


class ArxSettings(models.Model):
    """Singleton, editable in Django admin. Same pattern as nfc.NfcSettings."""

    SINGLETON_PK = 1

    class AlertStage(models.IntegerChoices):
        NONE = 0, "No email sent"
        AFTER_24_HOURS = 1, "Sent after 24 hours without a good sync"
        AFTER_72_HOURS = 2, "Sent again after 72 hours (the last one)"

    sync_enabled = models.BooleanField(default=False, help_text="Kill switch. When off the runner receives no work.")
    # When sync was last switched on: the alert clock starts there if no good sync came since.
    sync_enabled_at = models.DateTimeField(null=True, blank=True, editable=False)
    buffer_before_minutes = models.PositiveIntegerField(default=60, validators=[MaxValueValidator(24 * 60)])
    buffer_after_minutes = models.PositiveIntegerField(default=60, validators=[MaxValueValidator(24 * 60)])
    horizon_days = models.PositiveIntegerField(
        default=7,
        validators=[MinValueValidator(1), MaxValueValidator(60)],
        help_text="Only bookings starting within this many days are pushed to ARX.",
    )
    event_retention_days = models.PositiveIntegerField(
        default=60,
        validators=[MinValueValidator(1), MaxValueValidator(365)],
        help_text="Door events imported from ARX are deleted after this many days.",
    )
    # Exact ARX format names (ARX client, card formats). Both readers' formats give the
    # same number: the first 4 UID bytes, little-endian, all 10 digits (tested 2026-10-25).
    card_format_classic = models.CharField(
        max_length=100,
        default="Mifare CSN",
        help_text="ARX format for 4-byte MIFARE cards (template 'Mifare serial number').",
    )
    card_format_desfire = models.CharField(
        max_length=100,
        default="DESFire CSN",
        help_text="ARX format for 7-byte DESFire cards (template 'DESFire CSN Template').",
    )
    card_number_digits = models.PositiveSmallIntegerField(
        default=0,
        validators=[MaxValueValidator(10)],
        help_text=(
            "0 = send the whole 32-bit number, as the Mifare CSN and DESFire CSN formats use it. "
            "Set N only for a format that keeps just the last N digits (the 'External' format kept 9)."
        ),
    )
    # Who may call the runner API. Empty = any address (the bearer token is still required).
    runner_allowed_ips = models.TextField(
        blank=True,
        default="",
        help_text=(
            "Addresses or networks the JanHus runner calls from, one per line or comma separated, "
            "for example 203.0.113.7 or 203.0.113.0/29. Empty = no address check (the runner's "
            "token is still required). Update it before changing internet provider."
        ),
    )
    trust_x_forwarded_for = models.BooleanField(
        default=False,
        help_text=(
            "On only while the backend sits behind the AWS load balancer: the caller's address is "
            "then the last X-Forwarded-For entry. Off: the direct connection's address is used."
        ),
    )
    runner_last_seen_at = models.DateTimeField(null=True, blank=True, editable=False)
    # The runner reports after every access sync (POST /arx-runner/v1/status). apps.arx.alerts mails
    # the JanHus booking contact and Rubberdøk after 24 and 72 hours without a good sync, and once
    # more when it works again.
    runner_last_ok_at = models.DateTimeField(null=True, blank=True, editable=False)
    runner_last_error = models.CharField(max_length=60, blank=True, default="", editable=False)
    alert_stage = models.PositiveSmallIntegerField(choices=AlertStage.choices, default=AlertStage.NONE, editable=False)
    alert_sent_at = models.DateTimeField(null=True, blank=True, editable=False)
    # Good syncs in a row since the first of them, after an alert email.
    recovery_good_syncs = models.PositiveSmallIntegerField(default=0, editable=False)
    recovery_started_at = models.DateTimeField(null=True, blank=True, editable=False)
    # Set by the event import when door events in a known card format match no card
    # with card_number_digits as set, but would with another value. Cleared again once
    # events match normally. Holds counts only, never card numbers.
    card_digits_warning = models.CharField(max_length=200, blank=True, default="", editable=False)
    card_digits_warning_at = models.DateTimeField(null=True, blank=True, editable=False)

    class Meta:
        verbose_name = "ARX settings"
        verbose_name_plural = "ARX settings"

    def clean(self):
        if self.sync_enabled and not (self.card_format_classic.strip() and self.card_format_desfire.strip()):
            raise ValidationError("Set both ARX card format names before switching sync on")
        try:
            self.runner_networks()
        except ValueError as exc:
            raise ValidationError({"runner_allowed_ips": f"Not an address or network: {exc}"})

    def runner_networks(self) -> list:
        """The allowed runner addresses as networks; a bare address is a /32 (or /128)."""
        entries = [e.strip() for e in self.runner_allowed_ips.replace(",", "\n").splitlines() if e.strip()]
        return [ipaddress.ip_network(e, strict=False) for e in entries]

    def save(self, *args, **kwargs):
        self.pk = self.SINGLETON_PK
        self.full_clean()
        if self.sync_enabled and not ArxSettings.objects.filter(pk=self.pk, sync_enabled=True).exists():
            self.sync_enabled_at = timezone.now()
            if kwargs.get("update_fields") is not None:
                kwargs["update_fields"] = {*kwargs["update_fields"], "sync_enabled_at"}
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return "ARX settings"


def get_arx_settings() -> ArxSettings:
    obj, _ = ArxSettings.objects.get_or_create(pk=ArxSettings.SINGLETON_PK)
    return obj


class ArxAreaMapping(models.Model):
    """
    Which JanHus areas grant door access, and via which ARX access category.
    The category (with its doors and schedule) is created once in ARX by an admin;
    we only reference it by its external id.
    """

    area = models.OneToOneField("janhus.JanHusArea", on_delete=models.CASCADE, related_name="arx_mapping")
    grants_access = models.BooleanField(default=False)
    arx_category_id = models.CharField(max_length=100, blank=True, default="")
    notes = models.CharField(max_length=300, blank=True, default="")

    def clean(self):
        from django.core.exceptions import ValidationError

        if self.grants_access and not self.arx_category_id.strip():
            raise ValidationError("An area that grants access needs an ARX category id")

    def __str__(self) -> str:
        return f"{self.area} -> {self.arx_category_id or '-'} ({'on' if self.grants_access else 'off'})"


class ArxPersonSync(models.Model):
    """
    Per-person sync bookkeeping. The desired ARX state is recomputed from the
    database on every run; this row only remembers what was last confirmed.
    Holds no card number and no PIN. The only name is the ARX holder's during a
    card conflict, so an admin can compare it with the website name; it is
    cleared once the card is synced.
    """

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SYNCED = "SYNCED", "Synced"
        FAILED = "FAILED", "Failed"
        BLOCKED = "BLOCKED", "Blocked (no card or PIN)"

    # SET_NULL, not CASCADE: when a user is deleted the row must survive long
    # enough to clear what ARX still holds for that person.
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="arx_sync",
    )
    # Set instead of user for an external card holder. Both empty = the user or the
    # holder was deleted: ARX is cleared for that person, then the row is removed.
    external_holder = models.OneToOneField(
        "arx.ExternalCardHolder",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="arx_sync",
    )
    external_id = models.CharField(max_length=64, unique=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    synced_hash = models.CharField(max_length=64, blank=True, default="")
    # The hash last handed to the runner; a result is only accepted for it.
    issued_hash = models.CharField(max_length=64, blank=True, default="")
    attempts = models.PositiveIntegerField(default=0)
    last_error = models.CharField(max_length=60, blank=True, default="", help_text="Error class only, never ARX text.")
    last_attempt_at = models.DateTimeField(null=True, blank=True)
    synced_at = models.DateTimeField(null=True, blank=True)

    # Card conflict: the user's card belongs to a person someone created by hand in ARX.
    conflict_arx_person_id = models.CharField(max_length=64, blank=True, default="")
    conflict_arx_person_name = models.CharField(max_length=200, blank=True, default="")
    # The state that hit the conflict. It is not sent again until something changes
    # (an approval, a new card) or an admin asks for a retry.
    conflict_hash = models.CharField(max_length=64, blank=True, default="")

    # Takeover approved in Django admin: this card may be moved away from that ARX person.
    takeover_from_arx_person_id = models.CharField(max_length=64, blank=True, default="")
    takeover_card = models.ForeignKey("nfc.NfcCard", on_delete=models.SET_NULL, null=True, blank=True, related_name="+")
    takeover_approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )
    takeover_approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["status"], name="arx_personsync_status_idx")]
        # Nobody has it by default; superusers have every permission.
        permissions = [
            ("approve_card_takeover", "Can approve moving a card from a person added by hand in ARX"),
        ]


class ArxEventCursor(models.Model):
    """Singleton: newest ARX event timestamp (ms) already ingested."""

    SINGLETON_PK = 1
    last_timestamp_ms = models.BigIntegerField(default=0)


class ArxObservedCardFormat(models.Model):
    """
    The format ARX reported when it last read this card at a door. It beats the
    guess from the number, so a card registered under the wrong format is put
    right after its first failed attempt.
    """

    card = models.OneToOneField("nfc.NfcCard", on_delete=models.CASCADE, related_name="arx_observed_format")
    format_name = models.CharField(max_length=100)
    observed_at = models.DateTimeField(auto_now=True)


class ArxImportedEvent(models.Model):
    """Dedupe key for ARX events; deleting the NfcAccessEvent deletes this too."""

    arx_event_id = models.CharField(max_length=64, unique=True)
    event = models.OneToOneField("nfc.NfcAccessEvent", on_delete=models.CASCADE, related_name="arx_import")
    imported_at = models.DateTimeField(auto_now_add=True)


MANAGE_EXTERNAL_CARDS_PERMISSION = "arx.manage_external_card_access"
APPROVE_TAKEOVER_PERMISSION = "arx.approve_card_takeover"


class ExternalCardHolder(models.Model):
    """
    A door card for someone without a website account, for example the external
    booker of an event. It opens the door only during the bookings it is added to
    (ExternalBookingAccess), with the usual buffers, and needs a PIN like any card.

    Managed in Django admin by people with MANAGE_EXTERNAL_CARDS_PERMISSION
    (superusers only, until the permission is given to a group). A page on the
    website can later check the same permission.
    """

    name = models.CharField(max_length=150, help_text="Shown in ARX and in the door log.")
    card = models.OneToOneField("nfc.NfcCard", on_delete=models.PROTECT, related_name="external_holder")
    # Encrypted like the website users' PINs; read and set through pin_code.
    pin_code_encrypted = models.TextField(blank=True, default="", editable=False)
    notes = models.CharField(max_length=300, blank=True, default="")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "external card holder"
        permissions = [
            ("manage_external_card_access", "Can give external cards door access for JanHus bookings"),
        ]

    @property
    def pin_code(self) -> str:
        from apps.nfc.models import decrypt_pin

        return decrypt_pin(self.pin_code_encrypted)

    @pin_code.setter
    def pin_code(self, value: str) -> None:
        from apps.nfc.models import encrypt_pin, validate_pin_code

        value = (value or "").strip()
        validate_pin_code(value)
        self.pin_code_encrypted = encrypt_pin(value)

    @property
    def has_pin(self) -> bool:
        return bool(self.pin_code_encrypted)

    def clean(self):
        from apps.nfc.models import NfcCardAssignment

        if self.card_id and NfcCardAssignment.objects.filter(card_id=self.card_id, revoked_at__isnull=True).exists():
            raise ValidationError({"card": "The card is registered to a website user. Revoke that assignment first."})

    def __str__(self) -> str:
        return f"{self.name} (external card)"


class ExternalBookingAccess(models.Model):
    """Gives an external card door access during one JanHus booking."""

    booking = models.ForeignKey("janhus.JanHusBooking", on_delete=models.CASCADE, related_name="external_card_access")
    holder = models.ForeignKey(ExternalCardHolder, on_delete=models.CASCADE, related_name="booking_access")
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "external booking access"
        verbose_name_plural = "external booking access"
        constraints = [
            models.UniqueConstraint(fields=["booking", "holder"], name="arx_unique_external_access_per_booking"),
        ]

    def __str__(self) -> str:
        return f"{self.holder.name} -> booking {self.booking_id}"
