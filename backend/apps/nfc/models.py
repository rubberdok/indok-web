import re
from typing import Optional

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import Q
from django.utils import timezone


UID_7_BYTE_HEX_RE = re.compile(r"^[0-9A-F]{14}$") # 7 bytes = 14 hex characters, DENNE MÅ Å PASSE TIL KORTENE NTNU BRUKER, CHRISTIAN R. MÅ SJEKKE DETTE VED NY KORT ENDRING
PIN_CODE_RE = re.compile(r"^\d{4}$")


def normalize_uid_hex(uid_hex: str) -> str:
    """
    Canonicalize NFC UID to uppercase hex without separators.
    Example: "04:ab-12 cd 34 ef" -> "04AB12CD34EF"
    """
    return re.sub(r"[^0-9a-fA-F]", "", uid_hex).upper()


def validate_uid_hex(uid_hex: str) -> None:
    if not UID_7_BYTE_HEX_RE.match(uid_hex):
        raise ValidationError("UID must be exactly 7 bytes (14 hex characters)")


def validate_pin_code(pin_code: str) -> None:
    if pin_code and not PIN_CODE_RE.match(pin_code):
        raise ValidationError("PIN code must be exactly 4 digits (0-9)")


class NfcCard(models.Model):
    uid_hex = models.CharField(max_length=14, unique=True, db_index=True)
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
        self.uid_hex = normalize_uid_hex(self.uid_hex)
        validate_uid_hex(self.uid_hex)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"NfcCard(uid={self.uid_hex})"


class NfcCardAssignment(models.Model):
    card = models.ForeignKey(NfcCard, on_delete=models.CASCADE, related_name="assignments")
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
        validators=[RegexValidator(r"^\d{4}$", "PIN code must be exactly 4 digits (0-9)")],
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
            models.CheckConstraint(
                check=Q(access_end__isnull=True)
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
            raise ValidationError("Assignment must have either a user or an external_holder_name")

        if self.access_start and self.access_end and self.access_end < self.access_start:
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
        return f"NfcCardAssignment(card={self.card.uid_hex}, holder={holder})"


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
            models.CheckConstraint(
                check=Q(access_end__isnull=True)
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

        if self.access_start and self.access_end and self.access_end < self.access_start:
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
    source = models.CharField(max_length=20, choices=Source.choices, default=Source.UNKNOWN)

    door_identifier = models.CharField(max_length=120, blank=True, default="")
    uid_hex_reported = models.CharField(max_length=14, blank=True, default="")

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
            models.Index(fields=["uid_hex_reported", "occurred_at"]),
        ]

    def clean(self):
        if self.uid_hex_reported:
            self.uid_hex_reported = normalize_uid_hex(self.uid_hex_reported)
            validate_uid_hex(self.uid_hex_reported)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"NfcAccessEvent(type={self.event_type}, source={self.source}, occurred_at={self.occurred_at.isoformat()})"
