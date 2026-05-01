from typing import Optional

import graphene
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from decorators import login_required, permission_required
from graphql import GraphQLError

from .models import NfcAccessEvent, NfcAccessGrant, NfcCard, NfcCardAssignment, normalize_uid_hex
from .permissions import can_manage_booking_access
from .types import NfcAccessEventType, NfcAccessGrantType, NfcCardAssignmentType, NfcCardType

User = get_user_model()


class NfcCardInput(graphene.InputObjectType):
    uid_hex = graphene.String(required=True)
    label = graphene.String(required=False)
    notes = graphene.String(required=False)
    is_enabled = graphene.Boolean(required=False)


class AssignNfcCardInput(graphene.InputObjectType):
    uid_hex = graphene.String(required=True)
    user_id = graphene.ID(required=False)
    external_holder_name = graphene.String(required=False)
    access_start = graphene.DateTime(required=False)
    access_end = graphene.DateTime(required=False)
    permanent_access = graphene.Boolean(required=False)
    metadata = graphene.JSONString(required=False)


class RevokeNfcAssignmentInput(graphene.InputObjectType):
    assignment_id = graphene.ID(required=True)
    reason = graphene.String(required=False)


class CreateNfcAccessGrantInput(graphene.InputObjectType):
    scope = graphene.String(required=True)
    participant_policy = graphene.String(required=False)
    booking_id = graphene.ID(required=False)
    granted_to_user_id = graphene.ID(required=False)
    granted_to_uid_hex = graphene.String(required=False)
    access_start = graphene.DateTime(required=False)
    access_end = graphene.DateTime(required=False)
    permanent_access = graphene.Boolean(required=False)
    notes = graphene.String(required=False)


class RevokeNfcAccessGrantInput(graphene.InputObjectType):
    access_grant_id = graphene.ID(required=True)


class LogNfcAccessEventInput(graphene.InputObjectType):
    event_type = graphene.String(required=True)
    source = graphene.String(required=False)
    door_identifier = graphene.String(required=False)
    uid_hex_reported = graphene.String(required=False)
    resolved_user_id = graphene.ID(required=False)
    notes = graphene.String(required=False)
    raw_payload = graphene.JSONString(required=False)


class UpsertNfcCard(graphene.Mutation):
    ok = graphene.Boolean(required=True)
    card = graphene.Field(NfcCardType)

    class Arguments:
        card_data = NfcCardInput(required=True)

    @permission_required("nfc.manage_nfc")
    def mutate(self, info, card_data):
        normalized_uid = normalize_uid_hex(card_data["uid_hex"])

        card, created = NfcCard.objects.get_or_create(uid_hex=normalized_uid)
        for field in ["label", "notes", "is_enabled"]:
            if field in card_data and card_data.get(field) is not None:
                setattr(card, field, card_data[field])

        try:
            card.save()
        except ValidationError as e:
            raise GraphQLError(str(e))

        return UpsertNfcCard(ok=True, card=card)


class AssignNfcCard(graphene.Mutation):
    ok = graphene.Boolean(required=True)
    assignment = graphene.Field(NfcCardAssignmentType)

    class Arguments:
        assignment_data = AssignNfcCardInput(required=True)

    @permission_required("nfc.manage_nfc")
    def mutate(self, info, assignment_data):
        normalized_uid = normalize_uid_hex(assignment_data["uid_hex"])
        user = None

        user_id = assignment_data.get("user_id")
        if user_id:
            user = get_object_or_404(User, pk=user_id)

        with transaction.atomic():
            card, _ = NfcCard.objects.get_or_create(uid_hex=normalized_uid)

            card_active_assignment = card.assignments.filter(revoked_at__isnull=True).first()
            if card_active_assignment:
                card_active_assignment.revoke(
                    revoked_by=info.context.user,
                    reason="Auto-revoked due to reassignment",
                )

            if user is not None:
                user_active_assignment = NfcCardAssignment.objects.filter(user=user, revoked_at__isnull=True).first()
                if user_active_assignment:
                    user_active_assignment.revoke(
                        revoked_by=info.context.user,
                        reason="Auto-revoked because user got a new card",
                    )

            assignment = NfcCardAssignment(
                card=card,
                user=user,
                external_holder_name=assignment_data.get("external_holder_name", ""),
                assigned_by=info.context.user,
                access_start=assignment_data.get("access_start"),
                access_end=assignment_data.get("access_end"),
                permanent_access=assignment_data.get("permanent_access", False),
                metadata=assignment_data.get("metadata") or {},
            )

            try:
                assignment.save()
            except (ValidationError, IntegrityError) as e:
                raise GraphQLError(str(e))

        return AssignNfcCard(ok=True, assignment=assignment)


class RevokeNfcAssignment(graphene.Mutation):
    ok = graphene.Boolean(required=True)
    assignment = graphene.Field(NfcCardAssignmentType)

    class Arguments:
        revoke_data = RevokeNfcAssignmentInput(required=True)

    @permission_required("nfc.manage_nfc")
    def mutate(self, info, revoke_data):
        assignment = get_object_or_404(NfcCardAssignment, pk=revoke_data["assignment_id"])
        if assignment.revoked_at is None:
            assignment.revoked_at = timezone.now()
            assignment.revoked_by = info.context.user
            assignment.revocation_reason = revoke_data.get("reason", "")
            assignment.save(update_fields=["revoked_at", "revoked_by", "revocation_reason"])
        return RevokeNfcAssignment(ok=True, assignment=assignment)


class CreateNfcAccessGrant(graphene.Mutation):
    ok = graphene.Boolean(required=True)
    access_grant = graphene.Field(NfcAccessGrantType)

    class Arguments:
        grant_data = CreateNfcAccessGrantInput(required=True)

    @login_required
    def mutate(self, info, grant_data):
        user = info.context.user
        scope = grant_data["scope"]

        if scope == NfcAccessGrant.Scope.BOOKING and not can_manage_booking_access(user):
            raise GraphQLError("You do not have permission to manage booking NFC access")

        if scope != NfcAccessGrant.Scope.BOOKING and not user.has_perm("nfc.manage_nfc"):
            raise GraphQLError("You do not have permission to create NFC access grants")

        granted_to_user = None
        if grant_data.get("granted_to_user_id"):
            granted_to_user = get_object_or_404(User, pk=grant_data["granted_to_user_id"])

        granted_to_card = None
        if grant_data.get("granted_to_uid_hex"):
            granted_to_card = get_object_or_404(NfcCard, uid_hex=normalize_uid_hex(grant_data["granted_to_uid_hex"]))

        booking = None
        if grant_data.get("booking_id"):
            from apps.cabins.models import Booking

            booking = get_object_or_404(Booking, pk=grant_data["booking_id"])

        access_grant = NfcAccessGrant(
            scope=scope,
            participant_policy=grant_data.get("participant_policy", NfcAccessGrant.ParticipantPolicy.BOOKER_ONLY),
            booking=booking,
            granted_to_user=granted_to_user,
            granted_to_card=granted_to_card,
            granted_by=user,
            access_start=grant_data.get("access_start"),
            access_end=grant_data.get("access_end"),
            permanent_access=grant_data.get("permanent_access", False),
            notes=grant_data.get("notes", ""),
        )

        try:
            access_grant.save()
        except ValidationError as e:
            raise GraphQLError(str(e))

        return CreateNfcAccessGrant(ok=True, access_grant=access_grant)


class RevokeNfcAccessGrant(graphene.Mutation):
    ok = graphene.Boolean(required=True)
    access_grant = graphene.Field(NfcAccessGrantType)

    class Arguments:
        revoke_data = RevokeNfcAccessGrantInput(required=True)

    @permission_required("nfc.manage_nfc")
    def mutate(self, info, revoke_data):
        access_grant = get_object_or_404(NfcAccessGrant, pk=revoke_data["access_grant_id"])

        if access_grant.revoked_at is None:
            access_grant.revoked_at = timezone.now()
            access_grant.revoked_by = info.context.user
            access_grant.save(update_fields=["revoked_at", "revoked_by"])

        return RevokeNfcAccessGrant(ok=True, access_grant=access_grant)


class LogNfcAccessEvent(graphene.Mutation):
    ok = graphene.Boolean(required=True)
    event = graphene.Field(NfcAccessEventType)

    class Arguments:
        event_data = LogNfcAccessEventInput(required=True)

    @permission_required("nfc.add_nfcaccessevent")
    def mutate(self, info, event_data):
        normalized_uid: Optional[str] = None
        if event_data.get("uid_hex_reported"):
            normalized_uid = normalize_uid_hex(event_data["uid_hex_reported"])

        card = None
        assignment = None
        if normalized_uid:
            card = NfcCard.objects.filter(uid_hex=normalized_uid).first()
            if card:
                assignment = card.assignments.filter(revoked_at__isnull=True).select_related("user").first()

        resolved_user = None
        if event_data.get("resolved_user_id"):
            resolved_user = get_object_or_404(User, pk=event_data["resolved_user_id"])
        elif assignment and assignment.user:
            resolved_user = assignment.user

        event = NfcAccessEvent(
            event_type=event_data["event_type"],
            source=event_data.get("source", NfcAccessEvent.Source.UNKNOWN),
            door_identifier=event_data.get("door_identifier", ""),
            uid_hex_reported=normalized_uid or "",
            card=card,
            card_assignment=assignment,
            resolved_user=resolved_user,
            notes=event_data.get("notes", ""),
            raw_payload=event_data.get("raw_payload") or {},
        )

        try:
            event.save()
        except ValidationError as e:
            raise GraphQLError(str(e))

        return LogNfcAccessEvent(ok=True, event=event)
