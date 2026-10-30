import re

from django.conf import settings
from cryptography.fernet import Fernet, MultiFernet
from django.core.exceptions import ImproperlyConfigured, ValidationError
from django.db import models
from django.db.models import Q
from django.utils import timezone

# Per nå er det kun 10-digit MIFARE CSN, men vi skal over til DESFire kort i framtiden, usikker på situasjonen da.
PIN_CODE_RE = re.compile(r"^[0-9]{4}$")
MIFARE_CSN_10_DIGIT_RE = re.compile(r"^[0-9]{10}$")
PRINTED_UID_RE = re.compile(r"^[0-9]{15,17}$")
CARD_NUMBER_SEPARATORS_RE = re.compile(r"[\s.\-]")
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


NXP_MANUFACTURER_BYTE = 0x04  # byte 0 of every NXP 7-byte UID (DESFire NTNU cards)
CSN_LIMIT = 2**32
UID7_LIMIT = 2**56
CARD_NUMBER_NOT_RECOGNISED = "Kortnummeret ble ikke gjenkjent. Skriv det inn slik det står på kortet ditt."


def display_card_number(raw_identifier: str) -> str:
    """The digits from the card as the user typed them, without spaces, dots or dashes."""
    return CARD_NUMBER_SEPARATORS_RE.sub("", raw_identifier or "")


def normalize_mifare_csn(raw_identifier: str) -> str:
    """
    The 10-digit CSN the door reads (ARX formats "Mifare CSN" and "DESFire CSN"),
    from the digits printed on an NTNU card. Users only ever have these digits.

    - Older cards: the 10 digits after "mS" (or "M") are the CSN itself.
    - Newer DESFire cards: the 15-17 digits after "UID" are the 7-byte UID read
      as one little-endian number N. The door reads its first 4 bytes: N mod 2^32.
      Byte 0 of an NXP UID is always 0x04, so N mod 256 must be 4.
    Anything else comes back unchanged, so validation refuses it.

    Examples (made up): "1234 567-890" -> "1234567890";
    "14392683656882692" (UID 04 AA BB CC 11 22 33) -> "3434850820".
    """
    digits = display_card_number(raw_identifier)
    if PRINTED_UID_RE.fullmatch(digits):
        uid = int(digits)
        if uid < UID7_LIMIT and uid % 256 == NXP_MANUFACTURER_BYTE:
            return f"{uid % CSN_LIMIT:010d}"
    return digits


def validate_mifare_csn(mifare_csn: str) -> None:
    if not MIFARE_CSN_10_DIGIT_RE.fullmatch(mifare_csn) or int(mifare_csn) >= CSN_LIMIT:
        raise ValidationError(CARD_NUMBER_NOT_RECOGNISED)


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
        raise ValidationError(f"Kortnummer er for langt. Maks lengde er {MAX_CARD_IDENTIFIER_LENGTH} tegn")
    validate_mifare_csn(card_identifier)


def validate_pin_code(pin_code: str) -> None:
    if pin_code and not PIN_CODE_RE.match(pin_code):
        raise ValidationError("PIN code must be exactly 4 digits (0-9)")


def pin_encryption_keys() -> list:
    """
    NFC_PIN_ENCRYPTION_KEY: one Fernet key, or several separated by commas while the
    key is being changed. The first encrypts; every key in the list still decrypts,
    so no PIN is lost and nobody has to type theirs again (manage.py nfc_pin_key).
    """
    raw = getattr(settings, "NFC_PIN_ENCRYPTION_KEY", "") or ""
    return [key.strip() for key in raw.split(",") if key.strip()]


def pin_cipher() -> MultiFernet:
    keys = pin_encryption_keys()
    if not keys:
        raise ImproperlyConfigured("NFC_PIN_ENCRYPTION_KEY is not set")
    return MultiFernet([Fernet(key) for key in keys])


def encrypt_pin(pin_code: str) -> str:
    """Door PINs are stored encrypted, so a leaked database or backup does not reveal them."""
    return pin_cipher().encrypt(pin_code.encode()).decode() if pin_code else ""


def decrypt_pin(token: str) -> str:
    return pin_cipher().decrypt(token.encode()).decode() if token else ""


class NfcCard(models.Model):
    # The number the door reads (first 4 UID bytes, little-endian). Derived from
    # card_number when that is set; it is what ARX and the door logs use.
    mifare_csn = models.CharField(max_length=MAX_CARD_IDENTIFIER_LENGTH, unique=True, db_index=True)
    # What the user sees on their card, e.g. the 17-digit number on a DESFire
    # NTNU card. Shown back to the user so it matches the card in their hand.
    card_number = models.CharField(max_length=32, blank=True, default="")
    label = models.CharField(max_length=120, blank=True, default="")
    notes = models.CharField(max_length=500, blank=True, default="")
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        permissions = [
            ("manage_nfc", "Can manage NFC cards, assignments, and access grants"),
        ]

    def _derive_door_number(self) -> None:
        """When the number from the card is known, the door number always follows from it."""
        if self.card_number:
            self.card_number = display_card_number(self.card_number)
            self.mifare_csn = normalize_card_identifier(self.card_number)

    def clean(self):
        self._derive_door_number()
        if not self.card_number:
            self.mifare_csn = normalize_card_identifier(self.mifare_csn)
        validate_card_identifier(self.mifare_csn)

    @property
    def number_for_display(self) -> str:
        """What to show the user: the number from their card, or the door number for older registrations."""
        return self.card_number or self.mifare_csn

    def save(self, *args, **kwargs):
        self._derive_door_number()  # before full_clean, which checks fields before clean()
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"NfcCard(mifare_csn={self.mifare_csn})"


class NfcCardAssignment(models.Model):
    card = models.ForeignKey(NfcCard, on_delete=models.CASCADE, related_name="assignments")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_card_assignments",
    )

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_card_assignments_created",
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    # Door access at all times (board, caretaker and the like), not only during bookings.
    # apps.arx turns it into a rolling access window in ARX.
    permanent_access = models.BooleanField(default=False)

    # The PIN is needed in plain text only when it is sent to the door system.
    # Read and set it through the pin_code property.
    pin_code_encrypted = models.TextField(blank=True, default="", editable=False)

    revoked_at = models.DateTimeField(null=True, blank=True)
    revoked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nfc_card_assignments_revoked",
    )
    revocation_reason = models.CharField(max_length=300, blank=True, default="")

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
        ]
        indexes = [
            models.Index(fields=["user", "revoked_at"]),
            models.Index(fields=["card", "revoked_at"]),
        ]

    def clean(self):
        # Door access is per user; user only becomes empty when the user is deleted.
        if self._state.adding and self.user is None:
            raise ValidationError("Assignment must have a user")

        if self.revoked_at and self.revoked_at < self.assigned_at:
            raise ValidationError("revoked_at cannot be before assigned_at")

        validate_pin_code(self.pin_code)

    @property
    def pin_code(self) -> str:
        return decrypt_pin(self.pin_code_encrypted)

    @pin_code.setter
    def pin_code(self, value: str) -> None:
        value = (value or "").strip()
        validate_pin_code(value)
        self.pin_code_encrypted = encrypt_pin(value)

    @property
    def has_pin(self) -> bool:
        return bool(self.pin_code_encrypted)

    @property
    def is_active_assignment(self) -> bool:
        return self.revoked_at is None

    def revoke(self, revoked_by=None, reason: str = "") -> None:
        self.revoked_at = timezone.now()
        self.revoked_by = revoked_by
        self.revocation_reason = reason
        self.save(update_fields=["revoked_at", "revoked_by", "revocation_reason"])

    def __str__(self) -> str:
        holder = self.user.username if self.user else "(deleted user)"
        return f"NfcCardAssignment(card={self.card.mifare_csn}, holder={holder})"


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
    mifare_csn_reported = models.CharField(max_length=MAX_CARD_IDENTIFIER_LENGTH, blank=True, default="")
    # The name the door system has for the card's holder, also for people
    # outside indok-web. Shown in the door log; deleted with the event.
    person_name = models.CharField(max_length=200, blank=True, default="")

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
        permissions = [
            ("view_door_log", "Can view the JanHus door log"),
        ]
        indexes = [
            models.Index(fields=["occurred_at"]),
            models.Index(fields=["door_identifier", "occurred_at"]),
            models.Index(fields=["mifare_csn_reported", "occurred_at"]),
        ]

    def clean(self):
        if self.mifare_csn_reported:
            self.mifare_csn_reported = normalize_card_identifier(self.mifare_csn_reported)
            validate_card_identifier(self.mifare_csn_reported)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"""NfcAccessEvent(type={self.event_type},
        source={self.source}, occurred_at={self.occurred_at.isoformat()})"""
