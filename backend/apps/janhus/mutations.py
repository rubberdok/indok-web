import graphene
from django.contrib.auth import get_user_model
from graphql import GraphQLError

from apps.ecommerce.models import Product
from apps.janhus.mail import send_pending_review_notification
from apps.janhus.models import (
    JanHusAreaConfiguration,
    JanHusBooking,
    JanHusBookingRequest,
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
from apps.organizations.models import Organization


def _get_actor(info):
    user = info.context.user
    return user if user and user.is_authenticated else None


def _has_manage_booking_permission(user) -> bool:
    return bool(user and (user.is_superuser or user.has_perm("janhus.manage_booking")))


def _has_manage_settings_permission(user) -> bool:
    return bool(
        user
        and (
            user.is_superuser
            or user.has_perm("janhus.manage_settings")
            or user.has_perm("janhus.manage_booking")
        )
    )


def _is_owner(user, booking: JanHusBooking) -> bool:
    if not user:
        return False
    if booking.owner_user_id == user.id:
        return True
    if booking.owner_organization_id and booking.owner_organization.users.filter(id=user.id).exists():
        return True
    return False


def _apply_overlap_rules(*, booking: JanHusBooking, booking_level, actor, settings, exclude_booking_id=None):
    validate_time_rules(starts_at=booking.starts_at, ends_at=booking.ends_at, settings=settings)

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
        raise GraphQLError("The selected timeslot overlaps with an existing non-provisional booking")

    if not can_override_provisionals(booking_level=booking_level, starts_at=booking.starts_at, settings=settings):
        raise GraphQLError("Your booking level cannot override provisional reservations in this period")

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
    comment = graphene.String(required=False)


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

    bankid_provider = graphene.String(required=False)
    external_bookings_enabled = graphene.Boolean(required=False)


class JanHusAreaConfigurationInput(graphene.InputObjectType):
    area = graphene.String(required=True)
    internal_price_per_hour = graphene.Decimal(required=False)
    external_price_per_hour = graphene.Decimal(required=False)
    cleaning_fee = graphene.Decimal(required=False)


class CreateJanHusBooking(graphene.Mutation):
    class Arguments:
        booking_data = JanHusBookingInput(required=True)

    ok = graphene.Boolean()
    booking = graphene.Field(JanHusBookingType)

    def mutate(self, info, booking_data):
        actor = _get_actor(info)
        settings = get_or_create_settings()

        is_external_booking = bool(booking_data.get("is_external_booking", False) or not actor)

        owner_organization = None
        if booking_data.get("owner_organization_id"):
            owner_organization = Organization.objects.filter(id=booking_data.get("owner_organization_id")).first()
            if not owner_organization:
                raise GraphQLError("Organization not found")

        owner_user = None
        owner_user_id = booking_data.get("owner_user_id")
        if owner_user_id:
            if not _has_manage_booking_permission(actor):
                raise GraphQLError("Only JanHus booking admins may set owner_user explicitly")
            owner_user = get_user_model().objects.filter(id=owner_user_id).first()
            if not owner_user:
                raise GraphQLError("Owner user not found")

        if actor and not owner_user and not owner_organization and not is_external_booking:
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
            event_type=booking_data.get(
                "event_type",
                JanHusEventType.EXTERNAL if is_external_booking else JanHusEventType.INTERNAL,
            ),
            cleaning_requested=booking_data.get("cleaning_requested", False),
            deposit_status=booking_data.get("deposit_status", JanHusDepositStatus.REQUIRED),
            deposit_amount=booking_data.get("deposit_amount", 0),
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

        is_admin = _has_manage_booking_permission(actor)
        if not is_admin and not _is_owner(actor, booking):
            raise GraphQLError("You do not have permission to edit this booking")

        for field in [
            "starts_at",
            "ends_at",
            "area",
            "responsible_name",
            "responsible_email",
            "responsible_phone",
            "event_type",
            "cleaning_requested",
            "comment",
        ]:
            if field in booking_data and booking_data[field] is not None:
                setattr(booking, field, booking_data[field])

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

        status = review_data.get("status")
        if status:
            valid_statuses = {choice[0] for choice in JanHusBookingStatus.choices}
            if status not in valid_statuses:
                raise GraphQLError("Invalid booking status")
            booking.status = status

        if review_data.get("admin_comment") is not None:
            booking.admin_comment = review_data.get("admin_comment")

        if review_data.get("deposit_status"):
            valid_deposit_statuses = {choice[0] for choice in JanHusDepositStatus.choices}
            if review_data.get("deposit_status") not in valid_deposit_statuses:
                raise GraphQLError("Invalid deposit status")
            booking.deposit_status = review_data.get("deposit_status")

        if review_data.get("deposit_amount") is not None:
            booking.deposit_amount = review_data.get("deposit_amount")

        booking.full_clean()
        booking.save()

        return ReviewJanHusBooking(ok=True, booking=booking)


class CreateJanHusBookingRequest(graphene.Mutation):
    class Arguments:
        request_data = JanHusBookingRequestInput(required=True)

    ok = graphene.Boolean()
    booking_request = graphene.Field(JanHusBookingRequestType)

    def mutate(self, info, request_data):
        actor = _get_actor(info)
        settings = get_or_create_settings()

        is_non_indok_user = not actor
        if is_non_indok_user and not settings.external_bookings_enabled:
            raise GraphQLError("Eksterne bookingforespørsler er midlertidig deaktivert")

        validate_time_rules(starts_at=request_data["starts_at"], ends_at=request_data["ends_at"], settings=settings)

        owner_organization = None
        if request_data.get("owner_organization_id"):
            owner_organization = Organization.objects.filter(id=request_data.get("owner_organization_id")).first()
            if not owner_organization:
                raise GraphQLError("Organization not found")

        actor_phone = ""
        if actor:
            actor_phone = str(getattr(actor, "phone_number", "") or "")

        booking_request = JanHusBookingRequest(
            starts_at=request_data["starts_at"],
            ends_at=request_data["ends_at"],
            area=request_data["area"],
            requester_user=actor,
            owner_organization=owner_organization,
            requester_name=request_data.get("requester_name", actor.get_full_name() if actor else ""),
            requester_email=request_data.get("requester_email", actor.email if actor else ""),
            requester_phone=request_data.get("requester_phone", actor_phone),
            responsible_name=request_data["responsible_name"],
            responsible_email=request_data["responsible_email"],
            responsible_phone=request_data["responsible_phone"],
            event_type=request_data.get("event_type", JanHusEventType.INTERNAL),
            cleaning_requested=request_data.get("cleaning_requested", False),
            comment=request_data.get("comment", ""),
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

        valid_statuses = {choice[0] for choice in JanHusBookingRequest.RequestStatus.choices}
        status = review_data["status"]
        if status not in valid_statuses:
            raise GraphQLError("Invalid request status")

        booking_request.status = status
        if review_data.get("admin_comment") is not None:
            booking_request.admin_comment = review_data.get("admin_comment")

        created_booking = None
        if status == JanHusBookingRequest.RequestStatus.APPROVED and review_data.get("convert_to_booking", False):
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

            created_booking = JanHusBooking(
                starts_at=booking_request.starts_at,
                ends_at=booking_request.ends_at,
                area=booking_request.area,
                owner_user=booking_request.requester_user if not booking_request.owner_organization else None,
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
                comment=booking_request.comment,
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

        booking_request.save()

        return ReviewJanHusBookingRequest(ok=True, booking_request=booking_request, booking=created_booking)


class UpdateJanHusBookingSettings(graphene.Mutation):
    class Arguments:
        settings_data = JanHusBookingSettingsInput(required=True)

    ok = graphene.Boolean()
    booking_settings = graphene.Field(JanHusBookingSettingsType)

    def mutate(self, info, settings_data):
        actor = _get_actor(info)
        if not _has_manage_settings_permission(actor):
            raise GraphQLError("JanHus settings admin permission required")

        booking_settings = JanHusBookingSettings.objects.first() or JanHusBookingSettings()

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

        area_configuration, _ = JanHusAreaConfiguration.objects.get_or_create(area=area_data["area"])

        for field in ["internal_price_per_hour", "external_price_per_hour", "cleaning_fee"]:
            if area_data.get(field) is not None:
                setattr(area_configuration, field, area_data.get(field))

        area_configuration.full_clean()
        area_configuration.save()

        return UpdateJanHusAreaConfiguration(ok=True, area_configuration=area_configuration)


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

        if booking.vipps_product_id:
            return CreateJanHusPaymentProduct(ok=True, booking=booking, product_id=booking.vipps_product_id)

        organization = None
        if organization_id:
            organization = Organization.objects.filter(id=organization_id).first()
        elif booking.owner_organization_id:
            organization = booking.owner_organization

        if not organization:
            raise GraphQLError("An organization is required to create a Vipps product")

        product = Product.objects.create(
            name=f"JanHus booking #{booking.id}",
            description=(
                f"JanHus {booking.get_area_display()} from {booking.starts_at.isoformat()} to {booking.ends_at.isoformat()}"
            ),
            organization=organization,
            price=booking.total_price,
            total_quantity=1,
            max_buyable_quantity=1,
            shop_item=False,
        )

        booking.vipps_product = product
        booking.save(update_fields=["vipps_product", "updated_at"])

        return CreateJanHusPaymentProduct(ok=True, booking=booking, product_id=product.id)
