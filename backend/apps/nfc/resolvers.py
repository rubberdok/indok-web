from typing import Optional

from django.db.models import Q, Value
from django.db.models.functions import Concat

from decorators import login_required, permission_required
from django.utils import timezone

from apps.users.permissions import can_manage_user_nfc

from .models import NfcAccessEvent, NfcCard, NfcManualAccess
from .types import DoorLogPage

MAX_PAGE_SIZE = 200


class NfcResolvers:
    @login_required
    def resolve_nfc_door_access(self, info, past_days: Optional[int] = None):
        if not can_manage_user_nfc(info.context.user):
            raise PermissionError("Du har ikke tilgang til å se hvem som har adgang til JanHus")

        from apps.arx.overview import door_access_overview

        return door_access_overview(past_days=past_days)

    @login_required
    def resolve_nfc_manual_accesses(self, info):
        if not can_manage_user_nfc(info.context.user):
            raise PermissionError("Du har ikke tilgang til å se hvem som har adgang til JanHus")

        from apps.arx.services import manual_access_people

        accesses = list(
            NfcManualAccess.objects.filter(removed_at__isnull=True, ends_at__gt=timezone.now()).select_related(
                "user", "organization", "created_by"
            )
        )
        people = manual_access_people(accesses)
        for access in accesses:
            access.people_count = len(people[access.pk])
        return accesses

    @permission_required("nfc.view_door_log")
    def resolve_door_log(
        self,
        info,
        offset: int = 0,
        limit: int = 50,
        result: Optional[str] = None,
        search: Optional[str] = None,
        since=None,
        until=None,
    ):
        related = ["resolved_user", "card"]
        if any(rel.name == "external_holder" for rel in NfcCard._meta.related_objects):
            related.append("card__external_holder")  # apps.arx; one query for the whole page
        events = (
            NfcAccessEvent.objects.select_related(*related)
            .annotate(user_full_name=Concat("resolved_user__first_name", Value(" "), "resolved_user__last_name"))
            .order_by("-occurred_at")
        )
        if result in NfcAccessEvent.EventType.values:
            events = events.filter(event_type=result)
        if since:
            events = events.filter(occurred_at__gte=since)
        if until:
            events = events.filter(occurred_at__lt=until)
        term = (search or "").strip()[:100]
        if term:
            events = events.filter(
                Q(user_full_name__icontains=term)
                | Q(person_name__icontains=term)
                | Q(mifare_csn_reported__icontains=term)
                | Q(door_identifier__icontains=term)
            )
        limit = max(1, min(limit, MAX_PAGE_SIZE))
        offset = max(0, offset)
        return DoorLogPage(total=events.count(), events=list(events[offset : offset + limit]))
