from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from apps.organizations.models import Organization


class JanHusArea(models.TextChoices):
    FIRST_FLOOR = "FIRST_FLOOR", "1st floor"
    SECOND_FLOOR = "SECOND_FLOOR", "2nd floor"
    ENTIRE_HOUSE = "ENTIRE_HOUSE", "Entire house"


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
    can_override_lower_levels = models.BooleanField(default=False)
    can_edit_own_bookings_only = models.BooleanField(default=True)
    can_edit_all_bookings = models.BooleanField(default=False)

    booking_opens_weeks_before = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="If empty, the level can create bookings all year according to its flags.",
    )

    class Meta:
        ordering = ["-priority", "name"]

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

    external_bookings_enabled = models.BooleanField(default=True)

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
        if self.opening_hour > 23 or self.closing_hour > 23:
            raise ValidationError("Opening and closing hour must be between 0 and 23")

    def __str__(self):
        return "JanHus booking settings"


class JanHusAreaConfiguration(models.Model):
    area = models.CharField(max_length=32, choices=JanHusArea.choices, unique=True)

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
        ordering = ["area"]

    def __str__(self):
        return f"{self.get_area_display()} configuration"


class JanHusBooking(models.Model):
    class Meta:
        ordering = ["starts_at"]
        permissions = [
            ("manage_booking", "Can manage JanHus bookings"),
            ("manage_settings", "Can manage JanHus booking settings"),
            ("review_booking", "Can review JanHus bookings"),
        ]

    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    area = models.CharField(max_length=32, choices=JanHusArea.choices)

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
        return self.is_external_booking or self.event_type == JanHusEventType.EXTERNAL

    @property
    def total_price(self) -> Decimal:
        config = JanHusAreaConfiguration.objects.filter(area=self.area).first()
        if not config:
            return Decimal("0")

        duration = Decimal(self.duration_minutes)
        hourly_price = (
            config.external_price_per_hour
            if self.uses_external_pricing
            else config.internal_price_per_hour
        )
        base_price = (hourly_price * duration) / Decimal("60")

        if self.cleaning_requested:
            base_price += config.cleaning_fee

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
    area = models.CharField(max_length=32, choices=JanHusArea.choices)

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

    def __str__(self):
        return f"JanHus request {self.id} ({self.status})"
