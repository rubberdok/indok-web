import re
from inspect import signature
from typing import Any, Optional, cast

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import Q
from django.utils import timezone


# Per nå er det kun 10-digit MIFARE CSN, men vi skal over til DESFire kort i framtiden, usikker på situasjonen da.
PIN_CODE_RE = re.compile(r"^\d{4}$")
MIFARE_CSN_10_DIGIT_RE = re.compile(r"^\d{10}$")
LEGACY_MIFARE_IDENTIFIER_HEX_RE = re.compile(r"^[0-9A-Fa-f]+$")
MAX_CARD_IDENTIFIER_LENGTH = 64


class NfcSettings(models.Model):
    SINGLETON_PK = 1

    allow_user_mifare_csn_self_service = models.BooleanField(default=True)

    class Meta:
        verbose_name = "NFC settings"
        verbose_name_plural = "NFC settings"

    def save(self, *args, **kwargs):
        self.pk = self.SINGLETON_PK
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return "NFC settings"


def get_or_create_nfc_settings() -> NfcSettings:
    settings_obj, _created = NfcSettings.objects.get_or_create(
        pk=NfcSettings.SINGLETON_PK,
        defaults={
            "allow_user_mifare_csn_self_service": True,
        },
    )
    NfcSettings.objects.exclude(pk=NfcSettings.SINGLETON_PK).delete()
    return settings_obj


def is_user_mifare_csn_self_service_enabled() -> bool:
    return get_or_create_nfc_settings().allow_user_mifare_csn_self_service


def normalize_mifare_csn(raw_identifier: str) -> str:
    """
    Canonicalize card identifier to a 10-digit MIFARE CSN.

    Accepted inputs:
    - 10-digit card number (with optional non-digit separators)
    - 4-byte legacy MIFARE identifier (converted to CSN with little-endian byte order)

    Examples:
    - "1234 567-890" -> "1234567890"
    - "ABCD1234" -> "0873647531"
    """
    digits_only = re.sub(r"\D", "", raw_identifier)
    if MIFARE_CSN_10_DIGIT_RE.fullmatch(digits_only):
        return digits_only

    compact_legacy_identifier = re.sub(r"[^0-9A-Fa-f]", "", raw_identifier)
    if len(compact_legacy_identifier) in (8, 14) and LEGACY_MIFARE_IDENTIFIER_HEX_RE.fullmatch(compact_legacy_identifier):
        legacy_identifier_for_conversion = compact_legacy_identifier[:8]
        csn_value = int.from_bytes(
            bytes.fromhex(legacy_identifier_for_conversion), byteorder="little"
        )
        return f"{csn_value:010d}"

    return digits_only


def validate_mifare_csn(mifare_csn: str) -> None:
    if not MIFARE_CSN_10_DIGIT_RE.fullmatch(mifare_csn):
        raise ValidationError(
            "Kortnummer må være nøyaktig 10 sifre."
        )


def normalize_card_identifier(raw_identifier: str) -> str:
    """
    Project-wide entry point for card identifier normalization.

    Today this returns canonical MIFARE CSN, but the function exists so we can
    swap to another identifier strategy (e.g. DESFire card identifier) without rewriting all callers.
    """
    normalized_identifier = normalize_mifare_csn(raw_identifier)
    return normalized_identifier[:MAX_CARD_IDENTIFIER_LENGTH]


def validate_card_identifier(card_identifier: str) -> None:
    """
    Project-wide entry point for card identifier validation.
    """
    if len(card_identifier) > MAX_CARD_IDENTIFIER_LENGTH:
        raise ValidationError(
            f"Kortnummer er for langt. Maks lengde er {MAX_CARD_IDENTIFIER_LENGTH} tegn"
        )
    validate_mifare_csn(card_identifier)


def validate_pin_code(pin_code: str) -> None:
    if pin_code and not PIN_CODE_RE.match(pin_code):
        raise ValidationError("PIN code must be exactly 4 digits (0-9)")


def build_check_constraint(*, condition: Q, name: str) -> models.CheckConstraint:
    """
    Django 3.2 uses CheckConstraint(check=...), while newer stubs can require
    CheckConstraint(condition=...). Resolve this at runtime for compatibility.
    """
    supports_condition = "condition" in signature(models.CheckConstraint.__init__).parameters
    constraint_kwargs: dict[str, Any] = {"name": name}
    if supports_condition:
        constraint_kwargs["condition"] = condition
    else:
        constraint_kwargs["check"] = condition
    return models.CheckConstraint(**cast(Any, constraint_kwargs))


class NfcCard(models.Model):
    mifare_csn = models.CharField(
        max_length=MAX_CARD_IDENTIFIER_LENGTH, unique=True, db_index=True
    )
    label = models.CharField(max_length=120, blank=True, default="")
    notes = models.CharField(max_length=500, blank=True, default="")
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        permissions = [
            ("manage_nfc", "Can manage NFC cards, assignments, and access grants"),
        ]

    def clean(self):
        self.mifare_csn = normalize_card_identifier(self.mifare_csn)
        validate_card_identifier(self.mifare_csn)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"NfcCard(mifare_csn={self.mifare_csn})"


class NfcCardAssignment(models.Model):
    card = models.ForeignKey(
        NfcCard, on_delete=models.CASCADE, related_name="assignments"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_card_assignments",
    )
    external_holder_name = models.CharField(max_length=150, blank=True, default="")

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_card_assignments_created",
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    access_start = models.DateTimeField(null=True, blank=True)
    access_end = models.DateTimeField(null=True, blank=True)
    permanent_access = models.BooleanField(default=False)
    pin_code = models.CharField(
        max_length=4,
        blank=True,
        default="",
        validators=[
            RegexValidator(r"^\d{4}$", "PIN code must be exactly 4 digits (0-9)")
        ],
    )

    revoked_at = models.DateTimeField(null=True, blank=True)
    revoked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_card_assignments_revoked",
    )
    revocation_reason = models.CharField(max_length=300, blank=True, default="")

    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["card"],
                condition=Q(revoked_at__isnull=True),
                name="unique_active_nfc_assignment_per_card",
            ),
            models.UniqueConstraint(
                fields=["user"],
                condition=Q(revoked_at__isnull=True, user__isnull=False),
                name="unique_active_nfc_assignment_per_user",
            ),
            build_check_constraint(
                condition=Q(access_end__isnull=True)
                | Q(access_start__isnull=True)
                | Q(access_end__gte=models.F("access_start")),
                name="nfc_assignment_access_end_after_start",
            ),
        ]
        indexes = [
            models.Index(fields=["user", "revoked_at"]),
            models.Index(fields=["card", "revoked_at"]),
            models.Index(fields=["access_start", "access_end"]),
        ]

    def clean(self):
        if self.user is None and not self.external_holder_name:
            raise ValidationError(
                "Assignment must have either a user or an external_holder_name"
            )

        if (
            self.access_start
            and self.access_end
            and self.access_end < self.access_start
        ):
            raise ValidationError("access_end must be later than access_start")

        if self.revoked_at and self.revoked_at < self.assigned_at:
            raise ValidationError("revoked_at cannot be before assigned_at")

        validate_pin_code(self.pin_code)

    @property
    def is_active_assignment(self) -> bool:
        return self.revoked_at is None

    def has_access_at(self, when: Optional[timezone.datetime] = None) -> bool:
        when = when or timezone.now()

        if self.revoked_at is not None:
            return False

        if self.permanent_access:
            return True

        if self.access_start and when < self.access_start:
            return False

        if self.access_end and when > self.access_end:
            return False

        return True

    def revoke(self, revoked_by=None, reason: str = "") -> None:
        self.revoked_at = timezone.now()
        self.revoked_by = revoked_by
        self.revocation_reason = reason
        self.save(update_fields=["revoked_at", "revoked_by", "revocation_reason"])

    def __str__(self) -> str:
        holder = self.user.username if self.user else self.external_holder_name
        return f"NfcCardAssignment(card={self.card.mifare_csn}, holder={holder})"


class NfcAccessGrant(models.Model):
    class Scope(models.TextChoices):
        MANUAL = "MANUAL", "Manual"
        BOOKING = "BOOKING", "Booking"

    class ParticipantPolicy(models.TextChoices):
        BOOKER_ONLY = "BOOKER_ONLY", "Booker only"
        ALL_PARTICIPANTS = "ALL_PARTICIPANTS", "All participants"

    scope = models.CharField(max_length=25, choices=Scope.choices, default=Scope.MANUAL)
    participant_policy = models.CharField(
        max_length=25,
        choices=ParticipantPolicy.choices,
        default=ParticipantPolicy.BOOKER_ONLY,
    )

    booking = models.ForeignKey(
        "cabins.Booking",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_access_grants",
    )

    granted_to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_access_grants",
    )
    granted_to_card = models.ForeignKey(
        NfcCard,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="access_grants",
    )

    granted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_access_grants_created",
    )

    access_start = models.DateTimeField(null=True, blank=True)
    access_end = models.DateTimeField(null=True, blank=True)
    permanent_access = models.BooleanField(default=False)

    revoked_at = models.DateTimeField(null=True, blank=True)
    revoked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_access_grants_revoked",
    )

    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            build_check_constraint(
                condition=Q(access_end__isnull=True)
                | Q(access_start__isnull=True)
                | Q(access_end__gte=models.F("access_start")),
                name="nfc_grant_access_end_after_start",
            ),
        ]
        indexes = [
            models.Index(fields=["scope", "booking"]),
            models.Index(fields=["granted_to_user", "revoked_at"]),
            models.Index(fields=["granted_to_card", "revoked_at"]),
        ]

    def clean(self):
        if self.granted_to_user is None and self.granted_to_card is None:
            raise ValidationError("Grant must have granted_to_user or granted_to_card")

        if self.granted_to_user is not None and self.granted_to_card is not None:
            raise ValidationError("Grant can target either user or card, not both")

        if (
            self.access_start
            and self.access_end
            and self.access_end < self.access_start
        ):
            raise ValidationError("access_end must be later than access_start")

        if self.scope == self.Scope.BOOKING and self.booking is None:
            raise ValidationError("BOOKING scope grants must reference a booking")

    @property
    def is_active(self) -> bool:
        return self.revoked_at is None

    def has_access_at(self, when: Optional[timezone.datetime] = None) -> bool:
        when = when or timezone.now()

        if self.revoked_at is not None:
            return False

        if self.permanent_access:
            return True

        if self.access_start and when < self.access_start:
            return False

        if self.access_end and when > self.access_end:
            return False

        return True

    def __str__(self) -> str:
        target = self.granted_to_user or self.granted_to_card
        return f"NfcAccessGrant(scope={self.scope}, target={target})"


class NfcAccessEvent(models.Model):
    class EventType(models.TextChoices):
        ACCESS_GRANTED = "ACCESS_GRANTED", "Access granted"
        ACCESS_DENIED = "ACCESS_DENIED", "Access denied"
        DOOR_OPENED = "DOOR_OPENED", "Door opened"

    class Source(models.TextChoices):
        NFC_READER = "NFC_READER", "NFC reader"
        MANUAL_KEY = "MANUAL_KEY", "Manual key"
        BACKEND = "BACKEND", "Backend"
        UNKNOWN = "UNKNOWN", "Unknown"

    event_type = models.CharField(max_length=30, choices=EventType.choices)
    source = models.CharField(
        max_length=20, choices=Source.choices, default=Source.UNKNOWN
    )

    door_identifier = models.CharField(max_length=120, blank=True, default="")
    mifare_csn_reported = models.CharField(
        max_length=MAX_CARD_IDENTIFIER_LENGTH, blank=True, default=""
    )

    card = models.ForeignKey(
        NfcCard,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="access_events",
    )
    card_assignment = models.ForeignKey(
        NfcCardAssignment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="access_events",
    )
    resolved_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_access_events",
    )

    occurred_at = models.DateTimeField(default=timezone.now, db_index=True)
    notes = models.CharField(max_length=500, blank=True, default="")
    raw_payload = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["occurred_at"]),
            models.Index(fields=["door_identifier", "occurred_at"]),
            models.Index(fields=["mifare_csn_reported", "occurred_at"]),
        ]

    def clean(self):
        if self.mifare_csn_reported:
            self.mifare_csn_reported = normalize_card_identifier(
                self.mifare_csn_reported
            )
            validate_card_identifier(self.mifare_csn_reported)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"""NfcAccessEvent(type={self.event_type},
        source={self.source}, occurred_at={self.occurred_at.isoformat()})"""
