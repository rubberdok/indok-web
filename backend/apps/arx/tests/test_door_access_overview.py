import json
from datetime import datetime, timedelta, timezone as dt_timezone

from django.contrib.auth.models import Permission
from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.utils import timezone
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.organizations import OrganizationFactory
from utils.testing.factories.users import IndokUserFactory, UserFactory

from apps.arx import services
from apps.arx.models import ArxAreaMapping, ExternalBookingAccess, ExternalCardHolder, get_arx_settings
from apps.arx.overview import door_access_overview
from apps.janhus.models import JanHusArea, JanHusBooking, JanHusBookingStatus, JanHusDoorAccessPolicy
from apps.nfc.models import NfcCard, NfcCardAssignment, NfcManualAccess, NfcPermanentAccessChange, NfcUserNote
from apps.organizations.models import Membership
from apps.permissions.constants import HR_TYPE

OVERVIEW = """
    query Overview($pastDays: Int) {
      nfcDoorAccess(pastDays: $pastDays) {
        pastDays
        maxPastDays
        areasConnected
        people {
          key
          holderName
          cardNumber
          state
          blockedReason
          user { id firstName nfcNote organizations { id name } }
          periods { kind startsAt endsAt detail }
        }
      }
    }
"""
CREATE_ACCESS = """
    mutation Create($accessData: NfcManualAccessInput!) {
      createNfcManualAccess(accessData: $accessData) { manualAccess { id targetName peopleCount } }
    }
"""
REMOVE_ACCESS = "mutation Remove($id: ID!) { removeNfcManualAccess(id: $id) { ok } }"
MANUAL_LIST = (
    "query { nfcManualAccesses { id targetName peopleCount organizationPeople reason createdByName isOrganization } }"
)
UPDATE_NFC = """
    mutation AdminUpdateUserNfc($userId: ID!, $nfcData: AdminUserNfcInput!) {
      adminUpdateUserNfc(userId: $userId, nfcData: $nfcData) { user { id } }
    }
"""


def with_permission(user, codename):
    user.user_permissions.add(Permission.objects.get(codename=codename))
    return type(user).objects.get(pk=user.pk)


class OverviewBase(ExtendedGraphQLTestCase):
    def setUp(self):
        super().setUp()
        self.area, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        ArxAreaMapping.objects.create(area=self.area, grants_access=True, arx_category_id="cat-hus")
        self.nfc_admin = with_permission(UserFactory(), "manage_user_nfc")
        self.person = IndokUserFactory(graduation_year=timezone.now().year + 3)
        self.now = timezone.now()
        cfg = get_arx_settings()
        cfg.sync_enabled = True
        cfg.horizon_days = 7
        cfg.save()
        self._next_csn = 1000000000

    def card(self, user=None, pin="4321", permanent=False, until=None):
        self._next_csn += 1
        return NfcCardAssignment.objects.create(
            card=NfcCard.objects.create(mifare_csn=str(self._next_csn)),
            user=user or self.person,
            pin_code=pin,
            permanent_access=permanent,
            permanent_access_until=until,
        )

    def booking(self, start, end, **fields):
        fields.setdefault("owner_user", self.person)
        return JanHusBooking.objects.create(
            starts_at=start,
            ends_at=end,
            area=self.area,
            status=JanHusBookingStatus.CONFIRMED,
            responsible_name="Ansvarlig",
            responsible_email="ansvarlig@example.com",
            responsible_phone="41234567",
            **fields,
        )

    def row(self, overview, user=None):
        key = f"user-{(user or self.person).pk}"
        return next((person for person in overview.people if person.key == key), None)

    def windows(self, user=None):
        state = services.compute_desired_states(self.now).get(f"indok-{(user or self.person).pk}")
        return state.windows if state else ()


class OverviewStatesTests(OverviewBase):
    def test_someone_in_a_booking_now_has_access_now(self):
        self.card()
        self.booking(self.now - timedelta(hours=1), self.now + timedelta(hours=1))

        person = self.row(door_access_overview(now=self.now))

        self.assertEqual("NOW", person.state)
        self.assertEqual("", person.blocked_reason)
        self.assertEqual(["BOOKING"], [period.kind for period in person.periods])
        self.assertIn("Hele huset", person.periods[0].detail)

    def test_a_coming_booking_is_upcoming_however_far_ahead(self):
        self.card()
        self.booking(self.now + timedelta(days=40), self.now + timedelta(days=40, hours=2))

        self.assertEqual("UPCOMING", self.row(door_access_overview(now=self.now)).state)

    def test_how_far_back_follows_the_filter_up_to_the_retention_time(self):
        self.card()
        self.booking(self.now - timedelta(days=20), self.now - timedelta(days=20) + timedelta(hours=2))

        self.assertIsNone(self.row(door_access_overview(past_days=7, now=self.now)))
        overview = door_access_overview(past_days=30, now=self.now)
        self.assertEqual("PAST", self.row(overview).state)
        self.assertEqual(30, overview.past_days)

        cfg = get_arx_settings()
        cfg.event_retention_days = 14
        cfg.save()
        overview = door_access_overview(past_days=60, now=self.now)
        self.assertEqual(14, overview.past_days)
        self.assertEqual(14, overview.max_past_days)
        self.assertIsNone(self.row(overview))

    def test_zero_days_shows_no_past_access_and_one_day_is_the_default(self):
        self.card()
        self.booking(self.now - timedelta(hours=2), self.now - timedelta(hours=1))

        self.assertIsNone(self.row(door_access_overview(past_days=0, now=self.now)))

        overview = door_access_overview(now=self.now)
        self.assertEqual(1, overview.past_days)
        self.assertEqual("PAST", self.row(overview).state)

    def test_someone_who_would_have_access_but_has_no_card_is_shown_as_such(self):
        self.booking(self.now - timedelta(hours=1), self.now + timedelta(hours=1))

        person = self.row(door_access_overview(now=self.now))

        self.assertEqual("NOW", person.state)
        self.assertEqual("NO_CARD", person.blocked_reason)

    def test_a_past_booking_without_a_card_still_shows_what_was_missing(self):
        self.booking(self.now - timedelta(days=2), self.now - timedelta(days=2) + timedelta(hours=1))

        person = self.row(door_access_overview(past_days=7, now=self.now))

        self.assertEqual("PAST", person.state)
        self.assertEqual("NO_CARD", person.blocked_reason)

    def test_ended_permanent_access_is_not_held_back_by_a_missing_card(self):
        NfcPermanentAccessChange.objects.create(user=self.person, changed_by=self.nfc_admin, given=False)

        person = self.row(door_access_overview(now=timezone.now() + timedelta(seconds=1)))

        self.assertEqual("PAST", person.state)
        self.assertEqual("", person.blocked_reason)

    def test_the_blocked_reasons_match_what_the_door_sync_does(self):
        self.booking(self.now - timedelta(hours=1), self.now + timedelta(hours=1))
        assignment = self.card(pin="")
        self.assertEqual("NO_PIN", self.row(door_access_overview(now=self.now)).blocked_reason)
        self.assertEqual("no_pin", services.compute_desired_states(self.now)[f"indok-{self.person.pk}"].blocked_reason)

        assignment.pin_code = "1234"
        assignment.save()
        assignment.card.is_enabled = False
        assignment.card.save()
        self.assertEqual("CARD_DISABLED", self.row(door_access_overview(now=self.now)).blocked_reason)
        self.assertEqual("no_card", services.compute_desired_states(self.now)[f"indok-{self.person.pk}"].blocked_reason)

        self.person.is_active = False
        self.person.save()
        self.assertEqual("INACTIVE_USER", self.row(door_access_overview(now=self.now)).blocked_reason)

    def test_an_indistinguishable_card_and_guest_access_are_reported(self):
        cfg = get_arx_settings()
        cfg.card_number_digits = 9
        cfg.save()
        NfcCardAssignment.objects.create(
            card=NfcCard.objects.create(mifare_csn="1234567890"),
            user=self.person,
            pin_code="4321",
        )
        other = IndokUserFactory()
        NfcCardAssignment.objects.create(
            card=NfcCard.objects.create(mifare_csn="2234567890"),
            user=other,
            pin_code="4321",
        )
        guest = IndokUserFactory(feide_userid="door-overview-guest")
        self.booking(
            self.now - timedelta(hours=1),
            self.now + timedelta(hours=1),
            guest_list=json.dumps([guest.feide_userid]),
            door_access_policy=JanHusDoorAccessPolicy.ALL_PARTICIPANTS,
        )

        overview = door_access_overview(now=self.now)

        self.assertEqual("CARD_AMBIGUOUS", self.row(overview).blocked_reason)
        guest_person = self.row(overview, guest)
        self.assertIn("Gjest", guest_person.periods[0].detail)

    def test_a_booking_in_an_area_without_a_door_gives_no_access(self):
        other = JanHusArea.objects.create(name="Uten dør")
        JanHusBooking.objects.create(
            starts_at=self.now - timedelta(hours=1),
            ends_at=self.now + timedelta(hours=1),
            area=other,
            status=JanHusBookingStatus.CONFIRMED,
            owner_user=self.person,
            responsible_name="A",
            responsible_email="a@example.com",
            responsible_phone="41234567",
        )
        self.assertIsNone(self.row(door_access_overview(now=self.now)))

    def test_a_booking_that_is_not_confirmed_gives_no_access(self):
        self.booking(
            self.now - timedelta(hours=1),
            self.now + timedelta(hours=1),
        ).__class__.objects.update(status=JanHusBookingStatus.PENDING_ADMIN_REVIEW)
        self.assertIsNone(self.row(door_access_overview(now=self.now)))

    def test_permanent_and_temporary_are_told_apart(self):
        self.card(permanent=True)
        other = IndokUserFactory(graduation_year=self.now.year + 3)
        self.card(user=other, permanent=True, until=self.now + timedelta(days=10))

        overview = door_access_overview(now=self.now)

        self.assertEqual(["PERMANENT"], [period.kind for period in self.row(overview).periods])
        temporary = self.row(overview, other).periods[0]
        self.assertEqual("TEMPORARY", temporary.kind)
        self.assertEqual(self.now + timedelta(days=10), temporary.ends_at)

    def test_ended_permanent_access_is_past_and_removed_access_shows_for_the_period(self):
        self.card(permanent=True, until=self.now - timedelta(days=2))
        removed = IndokUserFactory()
        NfcPermanentAccessChange.objects.create(user=removed, changed_by=self.nfc_admin, given=False)

        overview = door_access_overview(now=timezone.now() + timedelta(seconds=1))

        self.assertEqual("PAST", self.row(overview).state)
        self.assertEqual("PAST", self.row(overview, removed).state)
        self.assertEqual("Fjernet", self.row(overview, removed).periods[0].detail)

    def test_permanent_access_began_when_it_was_given_not_when_the_end_date_was_set(self):
        self.card(permanent=True, until=self.now + timedelta(days=5))
        taken_away = NfcPermanentAccessChange.objects.create(user=self.person, changed_by=self.nfc_admin, given=False)
        given = NfcPermanentAccessChange.objects.create(user=self.person, changed_by=self.nfc_admin, given=True)
        NfcPermanentAccessChange.objects.create(user=self.person, changed_by=self.nfc_admin, given=True, reason="Til")

        periods = self.row(door_access_overview(now=timezone.now() + timedelta(seconds=1))).periods

        current = next(period for period in periods if period.kind == "TEMPORARY")
        self.assertEqual(given.changed_at, current.starts_at)
        self.assertNotEqual(taken_away.changed_at, current.starts_at)

    def test_someone_with_only_a_note_is_still_listed(self):
        NfcUserNote.objects.create(user=self.person, note="Vaktmester")
        person = self.row(door_access_overview(now=self.now))
        self.assertEqual("NOTE_ONLY", person.state)
        self.assertEqual("", person.blocked_reason)

    def test_an_external_card_is_listed_with_its_name(self):
        holder = ExternalCardHolder.objects.create(
            name="Ekstern Person", card=NfcCard.objects.create(mifare_csn="2000000001"), pin_code="1234"
        )
        booking = self.booking(self.now - timedelta(hours=1), self.now + timedelta(hours=1), owner_user=None)
        ExternalBookingAccess.objects.create(booking=booking, holder=holder)

        person = next(p for p in door_access_overview(now=self.now).people if p.key == f"holder-{holder.pk}")

        self.assertEqual("Ekstern Person", person.holder_name)
        self.assertEqual("NOW", person.state)
        self.assertEqual(["EXTERNAL"], [period.kind for period in person.periods])

    def test_the_cost_does_not_grow_with_the_number_of_people(self):
        def queries():
            with CaptureQueriesContext(connection) as captured:
                self.assertResponseNoErrors(self.query(OVERVIEW, user=self.nfc_admin, operation_name="Overview"))
            return len(captured)

        self.card(permanent=True)
        self.booking(self.now - timedelta(hours=1), self.now + timedelta(hours=1))
        first = queries()
        for i in range(6):
            user = IndokUserFactory()
            self.card(user=user, permanent=bool(i % 2))
            self.booking(self.now + timedelta(days=i + 1), self.now + timedelta(days=i + 1, hours=2), owner_user=user)
            NfcManualAccess.objects.create(user=user, starts_at=self.now, ends_at=self.now + timedelta(days=1))
            NfcUserNote.objects.create(user=user, note="Notat")
        self.assertLessEqual(queries(), first + 1)


class ManualAccessTests(OverviewBase):
    def manual(self, **fields):
        fields.setdefault("starts_at", self.now - timedelta(hours=1))
        fields.setdefault("ends_at", self.now + timedelta(days=2))
        if "organization" not in fields:
            fields.setdefault("user", self.person)
        return NfcManualAccess.objects.create(**fields)

    def test_a_person_gets_the_door_for_the_period(self):
        self.card()
        access = self.manual()

        windows = self.windows()
        self.assertEqual(1, len(windows))
        self.assertEqual("cat-hus", windows[0][0])
        self.assertEqual(access.ends_at.astimezone(dt_timezone.utc).strftime(services.UTC_FMT), windows[0][2])
        self.assertEqual("MANUAL", self.row(door_access_overview(now=self.now)).periods[0].kind)

    def test_a_removed_one_closes_the_door(self):
        self.card()
        access = self.manual()
        access.removed_at = self.now - timedelta(minutes=1)
        access.save()

        self.assertEqual((), self.windows())
        self.assertEqual("PAST", self.row(door_access_overview(now=self.now)).state)

    def test_not_before_the_horizon_but_listed_as_coming(self):
        self.card()
        self.manual(starts_at=self.now + timedelta(days=30), ends_at=self.now + timedelta(days=32))

        self.assertEqual((), self.windows())
        self.assertEqual("UPCOMING", self.row(door_access_overview(now=self.now)).state)

    def test_a_long_period_is_never_sent_as_a_longer_window_than_the_runner_takes(self):
        self.card()
        self.manual(ends_at=self.now + timedelta(days=300))

        ((_, start, end),) = self.windows()
        length = datetime.strptime(end, services.UTC_FMT) - datetime.strptime(start, services.UTC_FMT)
        self.assertLessEqual(length, timedelta(days=31))

    def test_an_organisation_gives_its_leaders_or_its_members(self):
        organization = OrganizationFactory()
        leader, member = IndokUserFactory(), IndokUserFactory()
        hr_group = organization.hr_group
        self.assertEqual(HR_TYPE, hr_group.group_type)
        Membership.objects.create(user=leader, organization=organization, group=hr_group)
        Membership.objects.create(user=member, organization=organization)
        for user in (leader, member):
            self.card(user=user)

        access = self.manual(organization=organization)
        self.assertTrue(self.windows(leader))
        self.assertFalse(self.windows(member))

        access.organization_people = NfcManualAccess.OrganizationPeople.MEMBERS
        access.save()
        self.assertTrue(self.windows(leader))
        self.assertTrue(self.windows(member))

    def test_old_ones_are_deleted_with_the_door_log(self):
        self.manual(starts_at=self.now - timedelta(days=90), ends_at=self.now - timedelta(days=80))
        keep = self.manual()

        services.prune_events(self.now)

        self.assertEqual([keep.pk], list(NfcManualAccess.objects.values_list("pk", flat=True)))

    def test_only_those_managing_door_access_may_create_list_or_remove(self):
        access = self.manual()
        data = {
            "userId": str(self.person.pk),
            "startsAt": self.now.isoformat(),
            "endsAt": (self.now + timedelta(days=1)).isoformat(),
        }
        for user in (None, IndokUserFactory()):
            with self.subTest(user=user):
                self.assertResponseHasErrors(self.query(OVERVIEW, user=user, operation_name="Overview"))
                self.assertResponseHasErrors(self.query(MANUAL_LIST, user=user))
                self.assertResponseHasErrors(
                    self.query(CREATE_ACCESS, user=user, operation_name="Create", variables={"accessData": data})
                )
                self.assertResponseHasErrors(
                    self.query(REMOVE_ACCESS, user=user, operation_name="Remove", variables={"id": str(access.pk)})
                )
        access.refresh_from_db()
        self.assertIsNone(access.removed_at)
        self.assertEqual(1, NfcManualAccess.objects.count())

    def test_create_list_and_remove(self):
        organization = OrganizationFactory()
        response = self.query(
            CREATE_ACCESS,
            user=self.nfc_admin,
            operation_name="Create",
            variables={
                "accessData": {
                    "organizationId": str(organization.pk),
                    "organizationPeople": "MEMBERS",
                    "startsAt": self.now.isoformat(),
                    "endsAt": (self.now + timedelta(days=1)).isoformat(),
                    "reason": "  Dugnad  ",
                }
            },
        )
        self.assertResponseNoErrors(response)
        access = NfcManualAccess.objects.get()
        self.assertEqual("Dugnad", access.reason)
        self.assertEqual(self.nfc_admin, access.created_by)

        listed = json.loads(self.query(MANUAL_LIST, user=self.nfc_admin).content)["data"]["nfcManualAccesses"]
        self.assertEqual(organization.name, listed[0]["targetName"])
        self.assertEqual(0, listed[0]["peopleCount"])
        self.assertTrue(listed[0]["isOrganization"])

        response = self.query(
            REMOVE_ACCESS, user=self.nfc_admin, operation_name="Remove", variables={"id": str(access.pk)}
        )
        self.assertResponseNoErrors(response)
        access.refresh_from_db()
        self.assertEqual(self.nfc_admin, access.removed_by)
        self.assertEqual(
            [], json.loads(self.query(MANUAL_LIST, user=self.nfc_admin).content)["data"]["nfcManualAccesses"]
        )

    def test_manual_access_list_shows_individual_targets(self):
        NfcManualAccess.objects.create(
            user=self.person,
            starts_at=self.now,
            ends_at=self.now + timedelta(days=1),
            created_by=self.nfc_admin,
        )

        listed = json.loads(self.query(MANUAL_LIST, user=self.nfc_admin).content)["data"]["nfcManualAccesses"]

        self.assertEqual(self.person.get_full_name() or self.person.username, listed[0]["targetName"])
        self.assertFalse(listed[0]["isOrganization"])

    def test_removing_an_unknown_manual_access_is_rejected(self):
        response = self.query(REMOVE_ACCESS, user=self.nfc_admin, operation_name="Remove", variables={"id": "999999"})

        self.assertResponseHasErrors(response)

    def test_bad_input_is_refused(self):
        organization = OrganizationFactory()
        start, later = self.now + timedelta(days=1), self.now + timedelta(days=2)
        cases = [
            {"startsAt": start.isoformat(), "endsAt": later.isoformat()},
            {
                "userId": str(self.person.pk),
                "organizationId": str(organization.pk),
                "startsAt": start.isoformat(),
                "endsAt": later.isoformat(),
            },
            {"userId": str(self.person.pk), "startsAt": later.isoformat(), "endsAt": start.isoformat()},
            {
                "userId": str(self.person.pk),
                "startsAt": (self.now - timedelta(days=3)).isoformat(),
                "endsAt": (self.now - timedelta(days=2)).isoformat(),
            },
            {"userId": "999999", "startsAt": start.isoformat(), "endsAt": later.isoformat()},
            {"organizationId": "999999", "startsAt": start.isoformat(), "endsAt": later.isoformat()},
        ]
        for data in cases:
            with self.subTest(data=data):
                self.assertResponseHasErrors(
                    self.query(
                        CREATE_ACCESS, user=self.nfc_admin, operation_name="Create", variables={"accessData": data}
                    )
                )
        self.assertFalse(NfcManualAccess.objects.exists())


class PermanentAccessEndDateTests(OverviewBase):
    def update(self, nfc_data):
        return self.query(
            UPDATE_NFC,
            user=self.nfc_admin,
            operation_name="AdminUpdateUserNfc",
            variables={"userId": str(self.person.pk), "nfcData": nfc_data},
        )

    def test_clearing_an_end_date_without_an_assignment_is_a_no_op(self):
        response = self.update({"permanentAccessUntil": None})

        self.assertResponseNoErrors(response)
        self.assertFalse(NfcCardAssignment.objects.filter(user=self.person, revoked_at__isnull=True).exists())

    def test_the_door_closes_at_the_end_date(self):
        until = self.now + timedelta(days=3)
        self.card(permanent=True, until=until)

        self.assertEqual(until.astimezone(dt_timezone.utc).strftime(services.UTC_FMT), self.windows()[0][2])

    def test_after_the_end_date_the_door_stays_closed_though_the_box_is_ticked(self):
        assignment = self.card(permanent=True, until=self.now - timedelta(minutes=1))

        self.assertEqual((), self.windows())
        from apps.nfc.models import permanent_access_status

        self.assertEqual("ENDED", permanent_access_status(self.person, assignment))

    def test_graduation_still_wins_when_it_comes_first(self):
        self.person.graduation_year = self.now.year - 1
        self.person.save()
        self.card(permanent=True, until=self.now + timedelta(days=3))

        self.assertEqual((), self.windows())

    def test_setting_changing_and_removing_it_is_kept_in_the_history(self):
        assignment = self.card(permanent=True)
        until = self.now + timedelta(days=3)

        self.assertResponseNoErrors(self.update({"permanentAccessUntil": until.isoformat()}))
        assignment.refresh_from_db()
        self.assertEqual(until, assignment.permanent_access_until)
        self.assertTrue(NfcPermanentAccessChange.objects.get().reason.startswith("Til "))

        self.assertResponseNoErrors(self.update({"permanentAccessUntil": None}))
        assignment.refresh_from_db()
        self.assertIsNone(assignment.permanent_access_until)
        self.assertEqual("Sluttdato fjernet", NfcPermanentAccessChange.objects.first().reason)

    def test_a_date_in_the_past_or_without_permanent_access_is_refused(self):
        self.card(permanent=True)
        self.assertResponseHasErrors(self.update({"permanentAccessUntil": (self.now - timedelta(days=1)).isoformat()}))

        other = NfcCardAssignment.objects.get()
        other.permanent_access = False
        other.save()
        self.assertResponseHasErrors(self.update({"permanentAccessUntil": (self.now + timedelta(days=1)).isoformat()}))

    def test_removing_permanent_access_clears_the_date(self):
        assignment = self.card(permanent=True, until=self.now + timedelta(days=3))

        self.assertResponseNoErrors(self.update({"permanentAccess": False}))

        assignment.refresh_from_db()
        self.assertIsNone(assignment.permanent_access_until)

    def test_a_new_card_keeps_the_date(self):
        until = self.now + timedelta(days=3)
        self.card(permanent=True, until=until)

        self.assertResponseNoErrors(self.update({"mifareCsn": "1999999999", "permanentAccess": True}))

        assignment = NfcCardAssignment.objects.get(user=self.person, revoked_at__isnull=True)
        self.assertEqual("1999999999", assignment.card.mifare_csn)
        self.assertEqual(until, assignment.permanent_access_until)
        self.assertFalse(NfcPermanentAccessChange.objects.exists())
