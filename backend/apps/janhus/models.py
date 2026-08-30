import secrets
from datetime import date
from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from apps.organizations.models import Organization


BOOKING_REFERENCE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"
BOOKING_REFERENCE_LENGTH = 8


def generate_booking_reference() -> str:
    body = "".join(
        secrets.choice(BOOKING_REFERENCE_ALPHABET)
        for _ in range(BOOKING_REFERENCE_LENGTH)
    )
    return f"JH-{body[:4]}-{body[4:]}"


class JanHusBookingStatus(models.TextChoices):
    PROVISIONAL = "PROVISIONAL", "Provisional"
    PENDING_ADMIN_REVIEW = "PENDING_ADMIN_REVIEW", "Pending admin review"
    CONFIRMED = "CONFIRMED", "Confirmed"
    DECLINED = "DECLINED", "Declined"
    CANCELLED = "CANCELLED", "Cancelled"
    BLOCKED = "BLOCKED", "Blocked"


class JanHusDepositStatus(models.TextChoices):
    NOT_REQUIRED = "NOT_REQUIRED", "Not required"
    REQUIRED = "REQUIRED", "Required"
    REQUESTED = "REQUESTED", "Requested"
    PAID = "PAID", "Paid"
    REFUNDED = "REFUNDED", "Refunded"
    WITHHELD = "WITHHELD", "Withheld"


class JanHusEventType(models.TextChoices):
    INTERNAL = "INTERNAL", "Internal"
    OPEN_FOR_INDOK = "OPEN_FOR_INDOK", "Open to all Indøk students"
    PRIVATE = "PRIVATE", "Private"
    EXTERNAL = "EXTERNAL", "External"


class JanHusDoorAccessPolicy(models.TextChoices):
    BOOKER_ONLY = "BOOKER_ONLY", "Booker only"
    ALL_PARTICIPANTS = "ALL_PARTICIPANTS", "Booker and guest list"


class JanHusBookingLevel(models.Model):
    """
    Configurable booking level.

    Levels should be managed from Django admin by superusers/privileged admins.
    """

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default="")
    priority = models.PositiveIntegerField(default=0)

    can_book_anytime = models.BooleanField(default=False)
    can_create_provisional = models.BooleanField(default=False)
    can_create_confirmed = models.BooleanField(default=True)
    can_challenge_provisionals = models.BooleanField(default=False)

    booking_opens_weeks_before = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="If empty, the level can create bookings all year according to its flags.",
    )

    class Meta:
        ordering = ["-priority", "name"]
        verbose_name = "JanHus booking level"
        verbose_name_plural = "JanHus booking levels"

    def __str__(self):
        return self.name


class JanHusUserBookingLevel(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="janhus_booking_level",
    )
    level = models.ForeignKey(
        JanHusBookingLevel,
        on_delete=models.CASCADE,
        related_name="user_assignments",
    )

    class Meta:
        verbose_name = "JanHus user booking level"
        verbose_name_plural = "JanHus user booking levels"

    def __str__(self):
        return f"{self.user}: {self.level.name}"


class JanHusOrganizationBookingLevel(models.Model):
    organization = models.OneToOneField(
        Organization,
        on_delete=models.CASCADE,
        related_name="janhus_booking_level",
    )
    level = models.ForeignKey(
        JanHusBookingLevel,
        on_delete=models.CASCADE,
        related_name="organization_assignments",
    )

    class Meta:
        verbose_name = "JanHus organization booking level"
        verbose_name_plural = "JanHus organization booking levels"

    def __str__(self):
        return f"{self.organization}: {self.level.name}"


class JanHusBookingSettings(models.Model):
    """
    Singleton-ish settings model for booking constraints and windows.
    """

    min_duration_minutes = models.PositiveIntegerField(default=60)
    slot_granularity_minutes = models.PositiveIntegerField(default=30)

    opening_hour = models.PositiveIntegerField(default=8)
    closing_hour = models.PositiveIntegerField(default=2)
    buffer_minutes = models.PositiveIntegerField(default=0)

    organization_booking_opens_weeks_before = models.PositiveIntegerField(default=6)
    general_booking_opens_weeks_before = models.PositiveIntegerField(default=4)

    fall_start_date = models.DateField(default=date(1970, 1, 1))
    fall_end_date = models.DateField(default=date(2100, 12, 31))
    spring_start_date = models.DateField(default=date(1970, 1, 1))
    spring_end_date = models.DateField(default=date(2100, 12, 31))
    fall_semester_active = models.BooleanField(default=True)
    spring_semester_active = models.BooleanField(default=True)

    external_bookings_enabled = models.BooleanField(default=True)
    private_bookings_enabled = models.BooleanField(default=True)
    cleaning_option_enabled = models.BooleanField(default=True)

    booking_contact_name = models.CharField(max_length=200, blank=True, default="")
    booking_contact_email = models.EmailField(blank=True, default="")
    booking_contact_phone = models.CharField(max_length=32, blank=True, default="")

    # The organization credited as the seller of JanHus payment products.
    # Set by a Django admin.
    payment_provider_organization = models.ForeignKey(
        "organizations.Organization",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="janhus_payment_settings",
    )

    class Meta:
        verbose_name = "JanHus booking settings"
        verbose_name_plural = "JanHus booking settings"

    def clean(self):
        if self.min_duration_minutes == 0:
            raise ValidationError("Minimum duration must be greater than 0 minutes")
        if self.slot_granularity_minutes == 0:
            raise ValidationError("Slot granularity must be greater than 0 minutes")
        if self.min_duration_minutes % self.slot_granularity_minutes != 0:
            raise ValidationError(
                "Minimum duration must be divisible by slot granularity"
            )
        if self.buffer_minutes % self.slot_granularity_minutes != 0:
            raise ValidationError(
                "Buffer between bookings must be divisible by slot granularity"
            )
        if self.opening_hour > 23 or self.closing_hour > 23:
            raise ValidationError("Opening and closing hour must be between 0 and 23")
        if self.fall_end_date < self.fall_start_date:
            raise ValidationError("Fall semester end date must be after start date")
        if self.spring_end_date < self.spring_start_date:
            raise ValidationError("Spring semester end date must be after start date")

    def __str__(self):
        return "JanHus booking settings"


class JanHusArea(models.Model):
    """
    A bookable area. Areas can be nested (e.g. "Entire house" contains "1st floor"),
    conflicts_with a booking of any ancestor or descendant area.
    """

    name = models.CharField(max_length=100, unique=True)
    parent = models.ForeignKey(
        "self", on_delete=models.PROTECT, null=True, blank=True, related_name="children"
    )
    is_active = models.BooleanField(default=True)

    internal_price_per_hour = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )
    external_price_per_hour = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )
    cleaning_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )
    default_deposit_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "JanHus area"
        verbose_name_plural = "JanHus areas"

    def __str__(self):
        return self.name

    @property
    def conflicting_area_ids(self) -> list:
        ids = {self.id}
        node = self.parent
        while node is not None:
            ids.add(node.id)
            node = node.parent
        ids.update(self._descendant_ids())
        return sorted(ids)

    def _descendant_ids(self) -> set:
        ids = set()
        for child in self.children.all():
            ids.add(child.id)
            ids.update(child._descendant_ids())
        return ids


class JanHusBooking(models.Model):
    class Meta:
        ordering = ["starts_at"]
        verbose_name = "JanHus booking"
        verbose_name_plural = "JanHus bookings"
        permissions = [
            ("manage_booking", "Can manage JanHus bookings"),
            ("manage_settings", "Can manage JanHus booking settings"),
            ("review_booking", "Can review JanHus bookings"),
        ]

    reference = models.CharField(
        max_length=16, unique=True, blank=True, editable=False, default=""
    )

    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    area = models.ForeignKey(JanHusArea, on_delete=models.PROTECT, related_name="bookings")

    status = models.CharField(
        max_length=32,
        choices=JanHusBookingStatus.choices,
        default=JanHusBookingStatus.PENDING_ADMIN_REVIEW,
    )

    owner_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="janhus_owned_bookings",
    )
    owner_organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="janhus_bookings",
    )
    booking_level = models.ForeignKey(
        JanHusBookingLevel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings",
    )
    created_by_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="janhus_created_bookings",
    )

    is_external_booking = models.BooleanField(default=False)

    booker_name = models.CharField(max_length=200, blank=True, default="")
    booker_email = models.EmailField(blank=True, default="")
    booker_phone = models.CharField(max_length=32, blank=True, default="")

    responsible_name = models.CharField(max_length=200)
    responsible_email = models.EmailField()
    responsible_phone = models.CharField(max_length=32)

    event_type = models.CharField(
        max_length=32, choices=JanHusEventType.choices, default=JanHusEventType.INTERNAL
    )
    cleaning_requested = models.BooleanField(default=False)

    deposit_status = models.CharField(
        max_length=32,
        choices=JanHusDepositStatus.choices,
        default=JanHusDepositStatus.REQUIRED,
    )
    deposit_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )

    # Admin overrides for pricing; price_override_amount takes precedence over price_override_tier
    price_override_tier = models.CharField(
        max_length=16,
        choices=[("INTERNAL", "Internal"), ("EXTERNAL", "External")],
        null=True,
        blank=True,
    )
    price_override_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    manually_marked_as_paid = models.BooleanField(default=False)

    comment = models.TextField(blank=True, default="")
    admin_comment = models.TextField(blank=True, default="")

    guest_list = models.TextField(blank=True, default="")
    door_access_policy = models.CharField(
        max_length=32,
        choices=JanHusDoorAccessPolicy.choices,
        default=JanHusDoorAccessPolicy.BOOKER_ONLY,
    )

    vipps_product = models.ForeignKey(
        "ecommerce.Product",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="janhus_bookings",
    )
    vipps_order = models.ForeignKey(
        "ecommerce.Order",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="janhus_bookings",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.reference:
            reference = generate_booking_reference()
            while JanHusBooking.objects.filter(reference=reference).exists():
                reference = generate_booking_reference()
            self.reference = reference
        return super().save(*args, **kwargs)

    def clean(self):
        if self.starts_at and self.ends_at and self.starts_at >= self.ends_at:
            raise ValidationError("Booking end must be after booking start")

        owners_selected = int(self.owner_user is not None) + int(
            self.owner_organization is not None
        )
        if owners_selected > 1:
            raise ValidationError(
                "A booking can have max one owner type: user OR organization"
            )

        if not self.is_external_booking and owners_selected == 0:
            raise ValidationError(
                "A non-external booking must have a user or organization owner"
            )

        if self.is_external_booking and owners_selected > 0:
            raise ValidationError("External bookings cannot have internal owners")

        if self.is_external_booking:
            self.event_type = JanHusEventType.EXTERNAL

    @property
    def duration_minutes(self) -> int:
        if not self.starts_at or not self.ends_at:
            return 0
        return int((self.ends_at - self.starts_at).total_seconds() // 60)

    @property
    def uses_external_pricing(self) -> bool:
        if self.price_override_tier:
            return self.price_override_tier == "EXTERNAL"
        return self.is_external_booking or self.event_type == JanHusEventType.EXTERNAL

    @property
    def total_price(self) -> Decimal:
        if self.price_override_amount is not None:
            return self.price_override_amount

        if not self.area_id:
            return Decimal("0")

        duration = Decimal(self.duration_minutes)
        hourly_price = (
            self.area.external_price_per_hour
            if self.uses_external_pricing
            else self.area.internal_price_per_hour
        )
        base_price = (hourly_price * duration) / Decimal("60")

        if self.cleaning_requested:
            base_price += self.area.cleaning_fee

        return base_price

    @property
    def outstanding_deposit_amount(self) -> Decimal:
        if self.deposit_status not in [
            JanHusDepositStatus.REQUIRED,
            JanHusDepositStatus.REQUESTED,
        ]:
            return Decimal("0")
        if self.deposit_amount <= 0:
            return Decimal("0")
        return self.deposit_amount

    @property
    def payment_total_price(self) -> Decimal:
        return self.total_price + self.outstanding_deposit_amount

    def __str__(self):
        owner = (
            self.owner_organization or self.owner_user or self.booker_name or "Unknown"
        )
        return f"JanHus booking {self.id} ({owner})"


class JanHusBookingRequest(models.Model):
    class RequestStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    area = models.ForeignKey(
        JanHusArea, on_delete=models.PROTECT, related_name="booking_requests"
    )

    requester_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="janhus_booking_requests",
    )
    owner_organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="janhus_booking_requests",
    )

    requester_name = models.CharField(max_length=200, blank=True, default="")
    requester_email = models.EmailField(blank=True, default="")
    requester_phone = models.CharField(max_length=32, blank=True, default="")

    responsible_name = models.CharField(max_length=200)
    responsible_email = models.EmailField()
    responsible_phone = models.CharField(max_length=32)

    event_type = models.CharField(
        max_length=32, choices=JanHusEventType.choices, default=JanHusEventType.INTERNAL
    )
    cleaning_requested = models.BooleanField(default=False)
    comment = models.TextField(blank=True, default="")
    guest_list = models.TextField(blank=True, default="")

    status = models.CharField(
        max_length=32, choices=RequestStatus.choices, default=RequestStatus.PENDING
    )
    admin_comment = models.TextField(blank=True, default="")

    converted_booking = models.ForeignKey(
        JanHusBooking,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="source_requests",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "JanHus booking request"
        verbose_name_plural = "JanHus booking requests"

    def __str__(self):
        return f"JanHus request {self.id} ({self.status})"
