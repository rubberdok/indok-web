from decimal import Decimal

import graphene
from django.contrib.auth import get_user_model
from django.db.models import Sum
from graphql import GraphQLError

from apps.ecommerce.models import Order, Product
from apps.janhus.guest_list import (
    find_missing_guest_feide_ids,
    normalize_guest_list_user_feide_ids,
    serialize_guest_list_user_feide_ids,
)
from apps.janhus.mail import send_pending_review_notification
from apps.janhus.models import (
    JanHusAreaConfiguration,
    JanHusBooking,
    JanHusBookingRequest,
    JanHusDoorAccessPolicy,
    JanHusBookingSettings,
    JanHusBookingStatus,
    JanHusDepositStatus,
    JanHusEventType,
)
from apps.janhus.rules import (
    can_override_provisionals,
    determine_initial_status,
    get_or_create_settings,
    get_overlapping_bookings,
    resolve_booking_level,
    validate_time_rules,
)
from apps.janhus.types import (
    JanHusAreaConfigurationType,
    JanHusBookingRequestType,
    JanHusBookingSettingsType,
    JanHusBookingType,
)
from apps.janhus.permissions import (
    can_edit_guest_list as _can_edit_guest_list,
    has_manage_booking_permission as _has_manage_booking_permission,
    has_manage_settings_permission as _has_manage_settings_permission,
    is_booking_owner as _is_owner,
)
from apps.organizations.models import Organization


SUCCESSFUL_PAYMENT_STATUSES = [
    Order.PaymentStatus.RESERVED,
    Order.PaymentStatus.CAPTURED,
]

JANHUS_PAYMENT_PROVIDER_PRIMARY_SLUG = "janus-eiendom"
JANHUS_PAYMENT_PROVIDER_PRIMARY_NAME = "Janus Eiendom"
JANHUS_PAYMENT_PROVIDER_FALLBACK_SLUG = "hovedstyret"
JANHUS_PAYMENT_PROVIDER_FALLBACK_NAME = "Hovedstyret"


def _get_actor(info):
    user = info.context.user
    return user if user and user.is_authenticated else None


def _get_default_deposit_amount(area: str):
    area_configuration = JanHusAreaConfiguration.objects.filter(area=area).first()
    if not area_configuration:
        return 0
    return area_configuration.default_deposit_amount


def _is_indok_user(actor) -> bool:
    return bool(actor and getattr(actor, "is_indok", False))


def _ensure_non_indok_external_only(
    *, actor, is_external_booking: bool, event_type: str, owner_organization
) -> None:
    if _is_indok_user(actor):
        return

    if (
        owner_organization is not None
        or not is_external_booking
        or event_type != JanHusEventType.EXTERNAL
    ):
        raise GraphQLError(
            "Only Indøk students can create non-external JanHus bookings"
        )


def _is_non_organization_booking(booking: JanHusBooking) -> bool:
    return booking.owner_organization_id is None


def _required_payment_amount_for_non_org_booking(booking: JanHusBooking) -> Decimal:
    required_deposit = max(booking.deposit_amount or Decimal("0"), Decimal("0"))
    return booking.total_price + required_deposit


def _successful_payment_orders_for_booking(booking: JanHusBooking):
    if not booking.vipps_product_id:
        return Order.objects.none()

    return Order.objects.filter(
        product_id=booking.vipps_product_id,
        payment_status__in=SUCCESSFUL_PAYMENT_STATUSES,
    )


def _paid_amount_for_booking(booking: JanHusBooking) -> Decimal:
    paid_amount = _successful_payment_orders_for_booking(booking).aggregate(
        total_paid=Sum("total_price")
    )["total_paid"]
    return paid_amount or Decimal("0")


def _outstanding_payment_amount_for_booking(booking: JanHusBooking) -> Decimal:
    if not _is_non_organization_booking(booking):
        return Decimal("0")

    outstanding_amount = _required_payment_amount_for_non_org_booking(
        booking
    ) - _paid_amount_for_booking(booking)
    return max(outstanding_amount, Decimal("0"))


def _attach_latest_successful_order(booking: JanHusBooking) -> None:
    latest_successful_order = (
        _successful_payment_orders_for_booking(booking).order_by("-timestamp").first()
    )
    if latest_successful_order and booking.vipps_order_id != latest_successful_order.id:
        booking.vipps_order = latest_successful_order


def _ensure_non_org_booking_paid_before_confirmation(booking: JanHusBooking) -> None:
    if not _is_non_organization_booking(booking):
        return

    required_payment = _required_payment_amount_for_non_org_booking(booking)
    if required_payment <= 0:
        return

    paid_amount = _paid_amount_for_booking(booking)
    if paid_amount < required_payment:
        missing_amount = required_payment - paid_amount
        raise GraphQLError(
            f"Non-organization bookings must be fully paid before being confirmed. Missing amount: {missing_amount} NOK"
        )

    _attach_latest_successful_order(booking)

    if booking.deposit_amount > 0 and booking.deposit_status in [
        JanHusDepositStatus.REQUIRED,
        JanHusDepositStatus.REQUESTED,
    ]:
        booking.deposit_status = JanHusDepositStatus.PAID


def _build_payment_product_data(booking: JanHusBooking) -> dict:
    outstanding_amount = _outstanding_payment_amount_for_booking(booking)
    return {
        "name": f"JanHus payment booking #{booking.id}",
        "description": (
            f"JanHus booking payment (rent + cleaning + deposit) for {booking.get_area_display()}"
            f" from {booking.starts_at.isoformat()}"
            f" to {booking.ends_at.isoformat()}"
        ),
        "price": outstanding_amount,
    }


# MÅ SJEKKES OVER - CHRISTIAN R
def _resolve_janhus_payment_provider_organization():
    organization = Organization.objects.filter(
        slug=JANHUS_PAYMENT_PROVIDER_PRIMARY_SLUG
    ).first()
    if organization:
        return organization

    organization = Organization.objects.filter(
        name__iexact=JANHUS_PAYMENT_PROVIDER_PRIMARY_NAME
    ).first()
    if organization:
        return organization

    # TODO: Janus Eiendom is not present in current test fixtures. Replace this fallback when fixtures are updated.
    organization = Organization.objects.filter(
        slug=JANHUS_PAYMENT_PROVIDER_FALLBACK_SLUG
    ).first()
    if organization:
        return organization

    return Organization.objects.filter(
        name__iexact=JANHUS_PAYMENT_PROVIDER_FALLBACK_NAME
    ).first()


def _resolve_payment_product_organization(*, organization_id=None):
    if organization_id:
        organization = Organization.objects.filter(id=organization_id).first()
        if not organization:
            raise GraphQLError("Organization not found")
        return organization

    provider_organization = _resolve_janhus_payment_provider_organization()
    if provider_organization:
        return provider_organization

    raise GraphQLError(
        "Could not find JanHus payment provider organization (Janus Eiendom, fallback Hovedstyret)"
    )


def _sync_existing_vipps_product(booking: JanHusBooking) -> None:
    if not booking.vipps_product_id or not booking.vipps_product:
        return

    product_data = _build_payment_product_data(booking)
    booking.vipps_product.name = product_data["name"]
    booking.vipps_product.description = product_data["description"]
    booking.vipps_product.price = product_data["price"]
    booking.vipps_product.save(update_fields=["name", "description", "price"])


def _apply_overlap_rules(
    *, booking: JanHusBooking, booking_level, actor, settings, exclude_booking_id=None
):
    validate_time_rules(
        starts_at=booking.starts_at, ends_at=booking.ends_at, settings=settings
    )

    overlaps = get_overlapping_bookings(
        starts_at=booking.starts_at,
        ends_at=booking.ends_at,
        area=booking.area,
        exclude_booking_id=exclude_booking_id,
    )

    displaced = []
    if not overlaps.exists():
        return displaced

    if _has_manage_booking_permission(actor):
        return displaced

    blocking = overlaps.exclude(status=JanHusBookingStatus.PROVISIONAL)
    if blocking.exists():
        raise GraphQLError(
            "The selected timeslot overlaps with an existing non-provisional booking"
        )

    if not can_override_provisionals(
        booking_level=booking_level, starts_at=booking.starts_at, settings=settings
    ):
        raise GraphQLError(
            "Your booking level cannot override provisional reservations in this period"
        )

    displaced = list(overlaps)
    overlaps.update(status=JanHusBookingStatus.PENDING_ADMIN_REVIEW)
    booking.status = JanHusBookingStatus.PENDING_ADMIN_REVIEW

    return displaced


class JanHusBookingInput(graphene.InputObjectType):
    starts_at = graphene.DateTime(required=True)
    ends_at = graphene.DateTime(required=True)
    area = graphene.String(required=True)

    owner_organization_id = graphene.ID(required=False)
    owner_user_id = graphene.ID(required=False)
    is_external_booking = graphene.Boolean(required=False)

    booker_name = graphene.String(required=False)
    booker_email = graphene.String(required=False)
    booker_phone = graphene.String(required=False)

    responsible_name = graphene.String(required=True)
    responsible_email = graphene.String(required=True)
    responsible_phone = graphene.String(required=True)

    event_type = graphene.String(required=False)
    cleaning_requested = graphene.Boolean(required=False)
    deposit_status = graphene.String(required=False)
    deposit_amount = graphene.Decimal(required=False)
    comment = graphene.String(required=False)


class UpdateJanHusBookingInput(graphene.InputObjectType):
    id = graphene.ID(required=True)

    starts_at = graphene.DateTime(required=False)
    ends_at = graphene.DateTime(required=False)
    area = graphene.String(required=False)

    responsible_name = graphene.String(required=False)
    responsible_email = graphene.String(required=False)
    responsible_phone = graphene.String(required=False)

    event_type = graphene.String(required=False)
    cleaning_requested = graphene.Boolean(required=False)
    booker_name = graphene.String(required=False)
    booker_email = graphene.String(required=False)
    booker_phone = graphene.String(required=False)
    status = graphene.String(required=False)
    deposit_status = graphene.String(required=False)
    deposit_amount = graphene.Decimal(required=False)
    guest_list = graphene.String(required=False)
    guest_list_user_feide_ids = graphene.List(
        graphene.NonNull(graphene.String), required=False
    )
    door_access_policy = graphene.String(required=False)
    comment = graphene.String(required=False)
    admin_comment = graphene.String(required=False)


class ReviewJanHusBookingInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    status = graphene.String(required=False)
    admin_comment = graphene.String(required=False)
    deposit_status = graphene.String(required=False)
    deposit_amount = graphene.Decimal(required=False)


class JanHusBookingRequestInput(graphene.InputObjectType):
    starts_at = graphene.DateTime(required=True)
    ends_at = graphene.DateTime(required=True)
    area = graphene.String(required=True)

    owner_organization_id = graphene.ID(required=False)

    requester_name = graphene.String(required=False)
    requester_email = graphene.String(required=False)
    requester_phone = graphene.String(required=False)

    responsible_name = graphene.String(required=True)
    responsible_email = graphene.String(required=True)
    responsible_phone = graphene.String(required=True)

    event_type = graphene.String(required=False)
    cleaning_requested = graphene.Boolean(required=False)
    comment = graphene.String(required=False)
    guest_list = graphene.String(required=False)


class ReviewJanHusBookingRequestInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    status = graphene.String(required=True)
    admin_comment = graphene.String(required=False)
    convert_to_booking = graphene.Boolean(required=False)


class JanHusBookingSettingsInput(graphene.InputObjectType):
    min_duration_minutes = graphene.Int(required=False)
    slot_granularity_minutes = graphene.Int(required=False)

    opening_hour = graphene.Int(required=False)
    closing_hour = graphene.Int(required=False)
    buffer_minutes = graphene.Int(required=False)

    organization_booking_opens_weeks_before = graphene.Int(required=False)
    general_booking_opens_weeks_before = graphene.Int(required=False)

    external_bookings_enabled = graphene.Boolean(required=False)


class JanHusAreaConfigurationInput(graphene.InputObjectType):
    area = graphene.String(required=True)
    internal_price_per_hour = graphene.Decimal(required=False)
    external_price_per_hour = graphene.Decimal(required=False)
    cleaning_fee = graphene.Decimal(required=False)
    default_deposit_amount = graphene.Decimal(required=False)


class CreateJanHusBooking(graphene.Mutation):
    class Arguments:
        booking_data = JanHusBookingInput(required=True)

    ok = graphene.Boolean()
    booking = graphene.Field(JanHusBookingType)

    def mutate(self, info, booking_data):
        actor = _get_actor(info)
        settings = get_or_create_settings()

        is_external_booking = bool(
            booking_data.get("is_external_booking", False) or not actor
        )
        resolved_event_type = booking_data.get(
            "event_type",
            (
                JanHusEventType.EXTERNAL
                if is_external_booking
                else JanHusEventType.INTERNAL
            ),
        )

        owner_organization = None
        if booking_data.get("owner_organization_id"):
            owner_organization = Organization.objects.filter(
                id=booking_data.get("owner_organization_id")
            ).first()
            if not owner_organization:
                raise GraphQLError("Organization not found")

        _ensure_non_indok_external_only(
            actor=actor,
            is_external_booking=is_external_booking,
            event_type=resolved_event_type,
            owner_organization=owner_organization,
        )

        owner_user = None
        owner_user_id = booking_data.get("owner_user_id")
        if owner_user_id:
            if not _has_manage_booking_permission(actor):
                raise GraphQLError(
                    "Only JanHus booking admins may set owner_user explicitly"
                )
            owner_user = get_user_model().objects.filter(id=owner_user_id).first()
            if not owner_user:
                raise GraphQLError("Owner user not found")

        if (
            actor
            and not owner_user
            and not owner_organization
            and not is_external_booking
        ):
            owner_user = actor

        booking_level = resolve_booking_level(
            user=owner_user or actor,
            owner_organization=owner_organization,
            is_external_booking=is_external_booking,
        )

        status = determine_initial_status(
            booking_level=booking_level,
            starts_at=booking_data["starts_at"],
            is_external_booking=is_external_booking,
            settings=settings,
        )

        booking = JanHusBooking(
            starts_at=booking_data["starts_at"],
            ends_at=booking_data["ends_at"],
            area=booking_data["area"],
            status=status,
            owner_user=owner_user,
            owner_organization=owner_organization,
            booking_level=booking_level,
            created_by_user=actor,
            is_external_booking=is_external_booking,
            booker_name=booking_data.get("booker_name", ""),
            booker_email=booking_data.get("booker_email", ""),
            booker_phone=booking_data.get("booker_phone", ""),
            responsible_name=booking_data["responsible_name"],
            responsible_email=booking_data["responsible_email"],
            responsible_phone=booking_data["responsible_phone"],
            event_type=resolved_event_type,
            cleaning_requested=booking_data.get("cleaning_requested", False),
            deposit_status=booking_data.get(
                "deposit_status", JanHusDepositStatus.REQUIRED
            ),
            deposit_amount=booking_data.get(
                "deposit_amount", _get_default_deposit_amount(booking_data["area"])
            ),
            comment=booking_data.get("comment", ""),
        )

        booking.full_clean()

        displaced = _apply_overlap_rules(
            booking=booking,
            booking_level=booking_level,
            actor=actor,
            settings=settings,
        )

        booking.save()

        if displaced:
            send_pending_review_notification([*displaced, booking])

        return CreateJanHusBooking(ok=True, booking=booking)


class UpdateJanHusBooking(graphene.Mutation):
    class Arguments:
        booking_data = UpdateJanHusBookingInput(required=True)

    ok = graphene.Boolean()
    booking = graphene.Field(JanHusBookingType)

    def mutate(self, info, booking_data):
        actor = _get_actor(info)
        if not actor:
            raise GraphQLError("Authentication required")

        try:
            booking = JanHusBooking.objects.get(pk=booking_data["id"])
        except JanHusBooking.DoesNotExist:
            raise GraphQLError("Booking not found")

        previous_status = booking.status

        is_admin = _has_manage_booking_permission(actor)
        is_owner = _is_owner(actor, booking)
        can_edit_guest_list = _can_edit_guest_list(actor, booking)

        if not is_admin and not is_owner and not can_edit_guest_list:
            raise GraphQLError("You do not have permission to edit this booking")

        if not is_admin:
            if not is_owner:
                for field, value in booking_data.items():
                    if (
                        field in ["id", "guest_list", "guest_list_user_feide_ids"]
                        or value is None
                    ):
                        continue
                    raise GraphQLError(
                        "You may only update `guest_list` for this booking"
                    )

            owner_restricted_fields = {
                "starts_at",
                "ends_at",
                "area",
                "status",
                "deposit_status",
                "deposit_amount",
                "admin_comment",
                "door_access_policy",
            }
            for field in owner_restricted_fields:
                if field in booking_data and booking_data.get(field) is not None:
                    raise GraphQLError(
                        f"Only JanHus booking admins may update `{field}`"
                    )

        if booking_data.get("guest_list_user_feide_ids") is not None:
            normalized_feide_ids = normalize_guest_list_user_feide_ids(
                booking_data.get("guest_list_user_feide_ids")
            )
            missing_feide_ids = find_missing_guest_feide_ids(normalized_feide_ids)
            if missing_feide_ids:
                raise GraphQLError("One or more guests could not be found by Feide ID")
            booking.guest_list = serialize_guest_list_user_feide_ids(
                normalized_feide_ids
            )
        elif booking_data.get("guest_list") is not None:
            booking.guest_list = booking_data.get("guest_list")

        for field in [
            "starts_at",
            "ends_at",
            "area",
            "responsible_name",
            "responsible_email",
            "responsible_phone",
            "event_type",
            "cleaning_requested",
            "booker_name",
            "booker_email",
            "booker_phone",
            "comment",
            "admin_comment",
        ]:
            if field in booking_data and booking_data[field] is not None:
                setattr(booking, field, booking_data[field])

        if booking_data.get("status") is not None:
            valid_statuses = {choice[0] for choice in JanHusBookingStatus.choices}
            if booking_data.get("status") not in valid_statuses:
                raise GraphQLError("Invalid booking status")
            booking.status = booking_data.get("status")

        if booking_data.get("deposit_status") is not None:
            valid_deposit_statuses = {
                choice[0] for choice in JanHusDepositStatus.choices
            }
            if booking_data.get("deposit_status") not in valid_deposit_statuses:
                raise GraphQLError("Invalid deposit status")
            booking.deposit_status = booking_data.get("deposit_status")

        if booking_data.get("deposit_amount") is not None:
            booking.deposit_amount = booking_data.get("deposit_amount")

        if booking_data.get("door_access_policy") is not None:
            valid_policies = {choice[0] for choice in JanHusDoorAccessPolicy.choices}
            if booking_data.get("door_access_policy") not in valid_policies:
                raise GraphQLError("Invalid door access policy")
            booking.door_access_policy = booking_data.get("door_access_policy")

        if (
            previous_status != JanHusBookingStatus.CONFIRMED
            and booking.status == JanHusBookingStatus.CONFIRMED
        ):
            _ensure_non_org_booking_paid_before_confirmation(booking)

        settings = get_or_create_settings()
        displaced = _apply_overlap_rules(
            booking=booking,
            booking_level=booking.booking_level,
            actor=actor,
            settings=settings,
            exclude_booking_id=booking.id,
        )

        booking.full_clean()
        booking.save()
        _sync_existing_vipps_product(booking)

        if displaced:
            send_pending_review_notification([*displaced, booking])

        return UpdateJanHusBooking(ok=True, booking=booking)


class ReviewJanHusBooking(graphene.Mutation):
    class Arguments:
        review_data = ReviewJanHusBookingInput(required=True)

    ok = graphene.Boolean()
    booking = graphene.Field(JanHusBookingType)

    def mutate(self, info, review_data):
        actor = _get_actor(info)
        if not _has_manage_booking_permission(actor):
            raise GraphQLError("JanHus booking admin permission required")

        try:
            booking = JanHusBooking.objects.get(pk=review_data["id"])
        except JanHusBooking.DoesNotExist:
            raise GraphQLError("Booking not found")

        previous_status = booking.status

        status = review_data.get("status")
        if status:
            valid_statuses = {choice[0] for choice in JanHusBookingStatus.choices}
            if status not in valid_statuses:
                raise GraphQLError("Invalid booking status")
            booking.status = status

        if review_data.get("admin_comment") is not None:
            booking.admin_comment = review_data.get("admin_comment")

        if review_data.get("deposit_status"):
            valid_deposit_statuses = {
                choice[0] for choice in JanHusDepositStatus.choices
            }
            if review_data.get("deposit_status") not in valid_deposit_statuses:
                raise GraphQLError("Invalid deposit status")
            booking.deposit_status = review_data.get("deposit_status")

        if review_data.get("deposit_amount") is not None:
            booking.deposit_amount = review_data.get("deposit_amount")

        if (
            previous_status != JanHusBookingStatus.CONFIRMED
            and booking.status == JanHusBookingStatus.CONFIRMED
        ):
            _ensure_non_org_booking_paid_before_confirmation(booking)

        booking.full_clean()
        booking.save()
        _sync_existing_vipps_product(booking)

        return ReviewJanHusBooking(ok=True, booking=booking)


class CreateJanHusBookingRequest(graphene.Mutation):
    class Arguments:
        request_data = JanHusBookingRequestInput(required=True)

    ok = graphene.Boolean()
    booking_request = graphene.Field(JanHusBookingRequestType)

    def mutate(self, info, request_data):
        actor = _get_actor(info)
        settings = get_or_create_settings()

        owner_organization = None
        if request_data.get("owner_organization_id"):
            owner_organization = Organization.objects.filter(
                id=request_data.get("owner_organization_id")
            ).first()
            if not owner_organization:
                raise GraphQLError("Organization not found")

        resolved_event_type = request_data.get("event_type", JanHusEventType.INTERNAL)
        non_indok_user = not _is_indok_user(actor)
        if non_indok_user and not settings.external_bookings_enabled:
            raise GraphQLError("Eksterne bookingforespørsler er midlertidig deaktivert")

        _ensure_non_indok_external_only(
            actor=actor,
            is_external_booking=(
                resolved_event_type == JanHusEventType.EXTERNAL
                and owner_organization is None
            ),
            event_type=resolved_event_type,
            owner_organization=owner_organization,
        )

        validate_time_rules(
            starts_at=request_data["starts_at"],
            ends_at=request_data["ends_at"],
            settings=settings,
        )

        actor_phone = ""
        if actor:
            actor_phone = str(getattr(actor, "phone_number", "") or "")

        booking_request = JanHusBookingRequest(
            starts_at=request_data["starts_at"],
            ends_at=request_data["ends_at"],
            area=request_data["area"],
            requester_user=actor,
            owner_organization=owner_organization,
            requester_name=request_data.get(
                "requester_name", actor.get_full_name() if actor else ""
            ),
            requester_email=request_data.get(
                "requester_email", actor.email if actor else ""
            ),
            requester_phone=request_data.get("requester_phone", actor_phone),
            responsible_name=request_data["responsible_name"],
            responsible_email=request_data["responsible_email"],
            responsible_phone=request_data["responsible_phone"],
            event_type=resolved_event_type,
            cleaning_requested=request_data.get("cleaning_requested", False),
            comment=request_data.get("comment", ""),
            guest_list=request_data.get("guest_list", ""),
        )
        booking_request.full_clean()
        booking_request.save()

        return CreateJanHusBookingRequest(ok=True, booking_request=booking_request)


class ReviewJanHusBookingRequest(graphene.Mutation):
    class Arguments:
        review_data = ReviewJanHusBookingRequestInput(required=True)

    ok = graphene.Boolean()
    booking_request = graphene.Field(JanHusBookingRequestType)
    booking = graphene.Field(JanHusBookingType)

    def mutate(self, info, review_data):
        actor = _get_actor(info)
        if not _has_manage_booking_permission(actor):
            raise GraphQLError("JanHus booking admin permission required")

        try:
            booking_request = JanHusBookingRequest.objects.get(pk=review_data["id"])
        except JanHusBookingRequest.DoesNotExist:
            raise GraphQLError("Booking request not found")

        valid_statuses = {
            choice[0] for choice in JanHusBookingRequest.RequestStatus.choices
        }
        status = review_data["status"]
        if status not in valid_statuses:
            raise GraphQLError("Invalid request status")

        booking_request.status = status
        if review_data.get("admin_comment") is not None:
            booking_request.admin_comment = review_data.get("admin_comment")

        created_booking = None
        if status == JanHusBookingRequest.RequestStatus.APPROVED and review_data.get(
            "convert_to_booking", False
        ):
            if booking_request.converted_booking_id:
                raise GraphQLError("Booking request has already been converted")

            settings = get_or_create_settings()
            is_external_booking = booking_request.requester_user is None

            booking_level = resolve_booking_level(
                user=booking_request.requester_user,
                owner_organization=booking_request.owner_organization,
                is_external_booking=is_external_booking,
            )

            initial_status = determine_initial_status(
                booking_level=booking_level,
                starts_at=booking_request.starts_at,
                is_external_booking=is_external_booking,
                settings=settings,
            )

            if _is_non_organization_booking(booking_request):
                initial_status = JanHusBookingStatus.PROVISIONAL

            created_booking = JanHusBooking(
                starts_at=booking_request.starts_at,
                ends_at=booking_request.ends_at,
                area=booking_request.area,
                owner_user=(
                    booking_request.requester_user
                    if not booking_request.owner_organization
                    else None
                ),
                owner_organization=booking_request.owner_organization,
                booking_level=booking_level,
                created_by_user=actor,
                is_external_booking=is_external_booking,
                booker_name=booking_request.requester_name,
                booker_email=booking_request.requester_email,
                booker_phone=booking_request.requester_phone,
                responsible_name=booking_request.responsible_name,
                responsible_email=booking_request.responsible_email,
                responsible_phone=booking_request.responsible_phone,
                event_type=booking_request.event_type,
                cleaning_requested=booking_request.cleaning_requested,
                deposit_status=JanHusDepositStatus.REQUIRED,
                deposit_amount=_get_default_deposit_amount(booking_request.area),
                comment=booking_request.comment,
                guest_list=booking_request.guest_list,
                status=initial_status,
            )
            displaced = _apply_overlap_rules(
                booking=created_booking,
                booking_level=booking_level,
                actor=actor,
                settings=settings,
            )
            created_booking.full_clean()
            created_booking.save()
            booking_request.converted_booking = created_booking

            if displaced:
                send_pending_review_notification([*displaced, created_booking])

            booking_request.delete()
            return ReviewJanHusBookingRequest(
                ok=True, booking_request=None, booking=created_booking
            )

        booking_request.save()

        return ReviewJanHusBookingRequest(
            ok=True, booking_request=booking_request, booking=created_booking
        )


class UpdateJanHusBookingSettings(graphene.Mutation):
    class Arguments:
        settings_data = JanHusBookingSettingsInput(required=True)

    ok = graphene.Boolean()
    booking_settings = graphene.Field(JanHusBookingSettingsType)

    def mutate(self, info, settings_data):
        actor = _get_actor(info)
        if not _has_manage_settings_permission(actor):
            raise GraphQLError("JanHus settings admin permission required")

        booking_settings = (
            JanHusBookingSettings.objects.first() or JanHusBookingSettings()
        )

        for field, value in settings_data.items():
            setattr(booking_settings, field, value)

        booking_settings.full_clean()
        booking_settings.save()

        return UpdateJanHusBookingSettings(ok=True, booking_settings=booking_settings)


class UpdateJanHusAreaConfiguration(graphene.Mutation):
    class Arguments:
        area_data = JanHusAreaConfigurationInput(required=True)

    ok = graphene.Boolean()
    area_configuration = graphene.Field(JanHusAreaConfigurationType)

    def mutate(self, info, area_data):
        actor = _get_actor(info)
        if not _has_manage_settings_permission(actor):
            raise GraphQLError("JanHus settings admin permission required")

        area_configuration, _ = JanHusAreaConfiguration.objects.get_or_create(
            area=area_data["area"]
        )

        for field in [
            "internal_price_per_hour",
            "external_price_per_hour",
            "cleaning_fee",
            "default_deposit_amount",
        ]:
            if area_data.get(field) is not None:
                setattr(area_configuration, field, area_data.get(field))

        area_configuration.full_clean()
        area_configuration.save()

        return UpdateJanHusAreaConfiguration(
            ok=True, area_configuration=area_configuration
        )


class CreateJanHusPaymentProduct(graphene.Mutation):
    class Arguments:
        booking_id = graphene.ID(required=True)
        organization_id = graphene.ID(required=False)

    ok = graphene.Boolean()
    booking = graphene.Field(JanHusBookingType)
    product_id = graphene.ID()

    def mutate(self, info, booking_id, organization_id=None):
        actor = _get_actor(info)
        if not _has_manage_booking_permission(actor):
            raise GraphQLError("JanHus booking admin permission required")

        try:
            booking = JanHusBooking.objects.get(pk=booking_id)
        except JanHusBooking.DoesNotExist:
            raise GraphQLError("Booking not found")

        if booking.owner_organization_id:
            raise GraphQLError(
                "Organization bookings are handled internally and cannot be paid directly via Vipps"
            )

        product_data = _build_payment_product_data(booking)

        if product_data["price"] <= 0:
            raise GraphQLError("Booking is already fully paid")

        if booking.vipps_product_id and booking.vipps_product:
            booking.vipps_product.name = product_data["name"]
            booking.vipps_product.description = product_data["description"]
            booking.vipps_product.price = product_data["price"]
            booking.vipps_product.save(update_fields=["name", "description", "price"])
            return CreateJanHusPaymentProduct(
                ok=True, booking=booking, product_id=booking.vipps_product_id
            )

        organization = _resolve_payment_product_organization(
            organization_id=organization_id
        )

        product = Product.objects.create(
            name=product_data["name"],
            description=product_data["description"],
            organization=organization,
            price=product_data["price"],
            total_quantity=1,
            max_buyable_quantity=1,
            shop_item=False,
        )

        booking.vipps_product = product
        booking.save(update_fields=["vipps_product", "updated_at"])

        return CreateJanHusPaymentProduct(
            ok=True, booking=booking, product_id=product.id
        )


class DeleteJanHusBooking(graphene.Mutation):
    class Arguments:
        booking_id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, booking_id):
        actor = _get_actor(info)
        if not _has_manage_booking_permission(actor):
            raise GraphQLError("JanHus booking admin permission required")

        deleted, _ = JanHusBooking.objects.filter(pk=booking_id).delete()
        if not deleted:
            raise GraphQLError("Booking not found")

        return DeleteJanHusBooking(ok=True)


class DeleteJanHusBookingRequest(graphene.Mutation):
    class Arguments:
        request_id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, request_id):
        actor = _get_actor(info)
        if not _has_manage_booking_permission(actor):
            raise GraphQLError("JanHus booking admin permission required")

        deleted, _ = JanHusBookingRequest.objects.filter(pk=request_id).delete()
        if not deleted:
            raise GraphQLError("Booking request not found")

        return DeleteJanHusBookingRequest(ok=True)
