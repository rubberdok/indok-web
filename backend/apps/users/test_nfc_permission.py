import json
from datetime import datetime

from django.contrib import admin
from django.contrib.auth.models import Permission
from django.db import connection
from django.test import RequestFactory
from django.test.utils import CaptureQueriesContext
from django.utils import timezone
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import IndokUserFactory, UserFactory

from apps.forms.models import Answer, Form, Question, Response
from apps.nfc.models import (
    NfcCard,
    NfcCardAssignment,
    NfcPermanentAccessChange,
    NfcUserNote,
    permanent_access_ends,
)
from apps.organizations.models import Organization

UPDATE_NFC = """
    mutation AdminUpdateUserNfc($userId: ID!, $nfcData: AdminUserNfcInput!) {
        adminUpdateUserNfc(userId: $userId, nfcData: $nfcData) { user { id } }
    }
"""
UPDATE_PROFILE = """
    mutation AdminUpdateUser($userId: ID!, $userData: AdminUserInput!) {
        adminUpdateUser(userId: $userId, userData: $userData) { user { id } }
    }
"""
PERMANENT_LIST = """
    query {
        nfcPermanentAccessUsers {
            id
            nfcCardNumber
            nfcHasPin
            nfcPermanentAccess
            nfcPermanentAccessStatus
            nfcPermanentAccessEnds
            nfcNote
            nfcNoteUpdatedBy
            organizations { name }
        }
    }
"""


def with_permission(user, codename):
    user.user_permissions.add(Permission.objects.get(codename=codename))
    return user


class NfcPermissionBase(ExtendedGraphQLTestCase):
    def setUp(self):
        super().setUp()
        self.nfc_admin = with_permission(UserFactory(), "manage_user_nfc")
        self.no_access = IndokUserFactory()
        self.target = IndokUserFactory(graduation_year=timezone.now().year + 3, allergies="Nøtter")

    def give_card(self, user=None, csn="1234567890", pin="4321", permanent=False):
        return NfcCardAssignment.objects.create(
            card=NfcCard.objects.create(mifare_csn=csn),
            user=user or self.target,
            pin_code=pin,
            permanent_access=permanent,
        )

    def update_nfc(self, nfc_data, user=None):
        return self.query(
            UPDATE_NFC,
            user=user or self.nfc_admin,
            operation_name="AdminUpdateUserNfc",
            variables={"userId": str(self.target.id), "nfcData": nfc_data},
        )

    def data(self, response, field):
        self.assertResponseNoErrors(response)
        return json.loads(response.content)["data"][field]


class ManageUserNfcAloneTests(NfcPermissionBase):
    """users.manage_user_nfc on its own: door access for others, and nothing about their profiles."""

    def test_capabilities(self):
        response = self.query("query { canManageUserProfiles canManageUserNfc }", user=self.nfc_admin)
        self.assertResponseNoErrors(response)
        self.assertEqual(
            json.loads(response.content)["data"],
            {"canManageUserProfiles": False, "canManageUserNfc": True},
        )

    def test_can_search_and_look_up_a_user(self):
        search = self.query(
            "query S($q: String!) { nfcUserSearch(query: $q) { id } }",
            user=self.nfc_admin,
            operation_name="S",
            variables={"q": self.target.username},
        )
        self.assertEqual(self.data(search, "nfcUserSearch"), [{"id": str(self.target.id)}])

        lookup = self.query(
            "query L($id: ID!) { nfcUser(id: $id) { id } }",
            user=self.nfc_admin,
            operation_name="L",
            variables={"id": str(self.target.id)},
        )
        self.assertEqual(self.data(lookup, "nfcUser"), {"id": str(self.target.id)})

    def test_can_set_card_pin_and_permanent_access(self):
        response = self.update_nfc({"mifareCsn": "1234567890", "pinCode": "4321", "permanentAccess": True})
        self.assertResponseNoErrors(response)

        assignment = NfcCardAssignment.objects.get(user=self.target, revoked_at__isnull=True)
        self.assertEqual(assignment.card.mifare_csn, "1234567890")
        self.assertEqual(assignment.pin_code, "4321")
        self.assertEqual(assignment.assigned_by, self.nfc_admin)
        self.assertTrue(assignment.permanent_access)

    def test_cannot_search_look_up_or_edit_profiles(self):
        self.assertResponseHasErrors(
            self.query(
                "query S($q: String!) { userSearch(query: $q) { id } }",
                user=self.nfc_admin,
                operation_name="S",
                variables={"q": self.target.username},
            )
        )
        self.assertResponseHasErrors(
            self.query(
                "query L($id: ID!) { adminUser(id: $id) { id } }",
                user=self.nfc_admin,
                operation_name="L",
                variables={"id": str(self.target.id)},
            )
        )
        self.assertResponseHasErrors(
            self.query(
                UPDATE_PROFILE,
                user=self.nfc_admin,
                operation_name="AdminUpdateUser",
                variables={"userId": str(self.target.id), "userData": {"firstName": "Endret"}},
            )
        )
        self.target.refresh_from_db()
        self.assertNotEqual(self.target.first_name, "Endret")

    def test_cannot_read_what_belongs_to_the_person(self):
        self.target.id_token = "the-persons-token"
        self.target.save(update_fields=["id_token"])

        response = self.query(
            "query L($id: ID!) { nfcUser(id: $id) { allergies idToken } }",
            user=self.nfc_admin,
            operation_name="L",
            variables={"id": str(self.target.id)},
        )
        self.assertEqual(self.data(response, "nfcUser"), {"allergies": None, "idToken": ""})


class FormAnswersTests(NfcPermissionBase):
    QUERY = "query L($id: ID!) { nfcUser(id: $id) { responses { answers { answer } } } }"

    def setUp(self):
        super().setUp()
        organization = Organization.objects.create(name="Hyttestyret", slug="hyttestyret-svar")
        form = Form.objects.create(name="Søknad", organization=organization)
        question = Question.objects.create(form=form, question="Hvorfor?")
        response = Response.objects.create(respondent=self.target, form=form)
        Answer.objects.create(question=question, response=response, answer="Privat svar")

    def test_door_admins_cannot_read_the_answers_of_others(self):
        response = self.query(
            self.QUERY, user=self.nfc_admin, operation_name="L", variables={"id": str(self.target.id)}
        )
        self.assertEqual(self.data(response, "nfcUser"), {"responses": []})

    def test_members_of_an_organisation_cannot_read_each_others_answers_or_token(self):
        self.target.id_token = "the-persons-token"
        self.target.save(update_fields=["id_token"])
        member = IndokUserFactory()
        shared = Organization.objects.create(name="Felles", slug="felles-svar")
        shared.users.add(member, self.target)

        response = self.query(
            "query O($id: ID!) { organization(id: $id) { users { id idToken responses { answers { answer } } } } }",
            user=member,
            operation_name="O",
            variables={"id": str(shared.id)},
        )
        found = next(user for user in self.data(response, "organization")["users"] if user["id"] == str(self.target.id))
        self.assertEqual(found, {"id": str(self.target.id), "idToken": "", "responses": []})

    def test_the_person_can_still_read_their_own(self):
        response = self.query("query { user { responses { answers { answer } } } }", user=self.target)
        self.assertEqual(self.data(response, "user"), {"responses": [{"answers": [{"answer": "Privat svar"}]}]})


class OtherRolesTests(NfcPermissionBase):
    def test_the_other_roles_may_also_give_permanent_access(self):
        roles = {
            "nfc.manage_nfc": with_permission(UserFactory(), "manage_nfc"),
            "users.manage_user_profiles": with_permission(UserFactory(), "manage_user_profiles"),
            "superuser": UserFactory(is_staff=True, is_superuser=True),
        }
        assignment = self.give_card()
        for name, role in roles.items():
            with self.subTest(role=name):
                NfcCardAssignment.objects.filter(pk=assignment.pk).update(permanent_access=False)
                self.assertResponseNoErrors(self.update_nfc({"permanentAccess": True}, user=role))
                assignment.refresh_from_db()
                self.assertTrue(assignment.permanent_access)

    def test_without_the_permission_nothing_is_allowed_or_shown(self):
        assignment = self.give_card(permanent=True)
        NfcUserNote.objects.create(user=self.target, note="Vaktmester")

        self.assertResponseHasErrors(self.update_nfc({"permanentAccess": False}, user=self.no_access))
        self.assertResponseHasErrors(self.update_nfc({"note": "Endret"}, user=self.no_access))
        assignment.refresh_from_db()
        self.assertTrue(assignment.permanent_access)
        self.assertEqual(NfcUserNote.objects.get(user=self.target).note, "Vaktmester")

        self.assertResponseHasErrors(self.query(PERMANENT_LIST, user=self.no_access))
        self.assertResponseHasErrors(self.query(PERMANENT_LIST))
        self.assertResponseHasErrors(
            self.query(
                "query L($id: ID!) { nfcUser(id: $id) { id } }",
                user=self.no_access,
                operation_name="L",
                variables={"id": str(self.target.id)},
            )
        )

    def test_nobody_sees_notes_through_other_ways_to_reach_a_user(self):
        self.give_card(permanent=True)
        NfcUserNote.objects.create(user=self.target, note="Vaktmester")
        own = self.query(
            """
            query {
                user { nfcNote nfcNoteUpdatedAt nfcNoteUpdatedBy nfcPermanentAccessStatus nfcPermanentAccessEnds }
            }
            """,
            user=self.target,
        )
        self.assertEqual(
            self.data(own, "user"),
            {
                "nfcNote": None,
                "nfcNoteUpdatedAt": None,
                "nfcNoteUpdatedBy": None,
                "nfcPermanentAccessStatus": None,
                "nfcPermanentAccessEnds": None,
            },
        )

    def test_the_own_id_token_is_still_readable(self):
        self.no_access.id_token = "my-token"
        self.no_access.save(update_fields=["id_token"])
        response = self.query("query { user { idToken } }", user=self.no_access)
        self.assertEqual(self.data(response, "user"), {"idToken": "my-token"})


class ExactLookupTests(NfcPermissionBase):
    def test_something_that_only_looks_like_a_number_finds_nobody(self):
        for user_id in ["²", "٣", "abc", "", "-1", "99999999999999999999999"]:
            with self.subTest(user_id):
                response = self.query(
                    "query L($id: ID!) { nfcUser(id: $id) { id } }",
                    user=self.nfc_admin,
                    operation_name="L",
                    variables={"id": user_id},
                )
                self.assertResponseNoErrors(response)
                self.assertIsNone(json.loads(response.content)["data"]["nfcUser"])

    def test_adminuser_finds_only_the_exact_id(self):
        admin = with_permission(UserFactory(), "manage_user_profiles")
        # A search for the id also matches this user, whose phone number contains it.
        UserFactory(phone_number=f"4{self.target.id:07d}", first_name="Aaa")

        response = self.query(
            "query L($id: ID!) { adminUser(id: $id) { id } }",
            user=admin,
            operation_name="L",
            variables={"id": str(self.target.id)},
        )
        self.assertEqual(self.data(response, "adminUser"), {"id": str(self.target.id)})

    def test_an_unknown_or_invalid_id_finds_nobody(self):
        for user_id in ("99999999", "abc"):
            with self.subTest(user_id=user_id):
                response = self.query(
                    "query L($id: ID!) { nfcUser(id: $id) { id } }",
                    user=self.nfc_admin,
                    operation_name="L",
                    variables={"id": user_id},
                )
                self.assertIsNone(self.data(response, "nfcUser"))


class PermanentAccessListTests(NfcPermissionBase):
    def list_users(self):
        return {
            user["id"]: user
            for user in self.data(self.query(PERMANENT_LIST, user=self.nfc_admin), "nfcPermanentAccessUsers")
        }

    def test_lists_only_those_with_permanent_access_or_a_note(self):
        self.give_card(permanent=True)
        self.give_card(user=IndokUserFactory(), csn="1234567891", permanent=False)

        retired_holder = IndokUserFactory()
        NfcUserNote.objects.create(user=retired_holder, note="Hadde kort")

        revoked = self.give_card(user=IndokUserFactory(), csn="1234567892", permanent=True)
        revoked.revoke(reason="test")

        found = self.list_users()
        self.assertEqual(set(found), {str(self.target.id), str(retired_holder.id)})
        self.assertEqual(found[str(retired_holder.id)]["nfcPermanentAccessStatus"], "NOT_GRANTED")
        self.assertEqual(found[str(retired_holder.id)]["nfcNote"], "Hadde kort")

    def test_status_says_why_the_box_opens_nothing(self):
        assignment = self.give_card(permanent=True)
        year = timezone.now().year

        def status():
            return self.list_users()[str(self.target.id)]["nfcPermanentAccessStatus"]

        self.assertEqual(status(), "ACTIVE")

        assignment.pin_code = ""
        assignment.save(update_fields=["pin_code_encrypted"])
        self.assertEqual(status(), "NO_PIN")

        assignment.pin_code = "4321"
        assignment.save(update_fields=["pin_code_encrypted"])
        NfcCard.objects.filter(pk=assignment.card_id).update(is_enabled=False)
        self.assertEqual(status(), "CARD_DISABLED")

        NfcCard.objects.filter(pk=assignment.card_id).update(is_enabled=True)
        self.target.graduation_year = year - 1
        self.target.save(update_fields=["graduation_year"])
        self.assertEqual(status(), "ENDED")

        self.target.graduation_year = year + 3
        self.target.is_active = False
        self.target.save(update_fields=["graduation_year", "is_active"])
        self.assertEqual(status(), "INACTIVE_USER")

    def test_shows_when_access_ends_and_the_organisations(self):
        self.give_card(permanent=True)
        organization = Organization.objects.create(name="Hyttestyret", slug="hyttestyret-test")
        organization.users.add(self.target)

        found = self.list_users()[str(self.target.id)]
        self.assertEqual(
            datetime.fromisoformat(found["nfcPermanentAccessEnds"]),
            permanent_access_ends(self.target.graduation_year),
        )
        self.assertEqual(found["organizations"], [{"name": "Hyttestyret"}])

    def test_costs_the_same_for_many_people(self):
        def list_with(count):
            for i in range(count):
                user = IndokUserFactory()
                NfcCardAssignment.objects.create(
                    card=NfcCard.objects.create(mifare_csn=f"{count * 100 + i:010d}"),
                    user=user,
                    pin_code="1234",
                    permanent_access=True,
                )
                NfcUserNote.objects.create(user=user, note="Styret", updated_by=self.nfc_admin)
                organization = Organization.objects.create(name=f"Org {count} {i}", slug=f"org-{count}-{i}")
                organization.users.add(user)
            with CaptureQueriesContext(connection) as queries:
                response = self.query(PERMANENT_LIST, user=self.nfc_admin)
            found = self.data(response, "nfcPermanentAccessUsers")
            self.assertTrue(all(user["nfcHasPin"] and user["nfcNote"] and user["organizations"] for user in found))
            return len(found), len(queries)

        list_with(1)  # warms caches that are filled once per test
        people_before, before = list_with(2)
        people_after, after = list_with(5)
        self.assertGreater(people_after, people_before)
        self.assertEqual(after, before)


class NoteTests(NfcPermissionBase):
    def note(self):
        return NfcUserNote.objects.filter(user=self.target).first()

    def test_nfc_note_updated_at_is_visible_to_nfc_admins(self):
        query = "query User($id: ID!) { nfcUser(id: $id) { nfcNoteUpdatedAt } }"
        NfcUserNote.objects.create(user=self.target, note="Vaktmester")

        with_note = self.query(query, user=self.nfc_admin, operation_name="User", variables={"id": str(self.target.pk)})
        updated_at = self.data(with_note, "nfcUser")["nfcNoteUpdatedAt"]
        self.assertIsNotNone(datetime.fromisoformat(updated_at.replace("Z", "+00:00")))

        without_note = self.query(
            query, user=self.nfc_admin, operation_name="User", variables={"id": str(self.no_access.pk)}
        )
        self.assertIsNone(self.data(without_note, "nfcUser")["nfcNoteUpdatedAt"])

    def test_note_and_access_history_have_readable_names(self):
        note = NfcUserNote.objects.create(user=self.target, note="Vaktmester")
        change = NfcPermanentAccessChange.objects.create(user=self.target, changed_by=self.nfc_admin, given=True)

        self.assertEqual(f"NfcUserNote(user={self.target.pk})", str(note))
        self.assertEqual(f"NfcPermanentAccessChange(user={self.target.pk}, given=True)", str(change))

    def test_note_is_saved_with_who_wrote_it(self):
        self.give_card(permanent=True)
        self.assertResponseNoErrors(self.update_nfc({"note": "  Vaktmester  "}))
        self.assertEqual(self.note().note, "Vaktmester")
        self.assertEqual(self.note().updated_by, self.nfc_admin)

    def test_saving_the_same_note_does_not_change_who_wrote_it(self):
        self.give_card(permanent=True)
        NfcUserNote.objects.create(user=self.target, note="Vaktmester", updated_by=self.no_access)
        self.assertResponseNoErrors(self.update_nfc({"note": "Vaktmester"}))
        self.assertEqual(self.note().updated_by, self.no_access)

    def test_note_needs_permanent_access(self):
        self.give_card(permanent=False)
        self.assertResponseHasErrors(self.update_nfc({"note": "Vaktmester"}))
        self.assertIsNone(self.note())

    def test_note_has_a_maximum_length(self):
        self.give_card(permanent=True)
        self.assertResponseHasErrors(self.update_nfc({"note": "x" * (NfcUserNote.MAX_LENGTH + 1)}))
        self.assertIsNone(self.note())

    def test_an_empty_note_removes_it(self):
        NfcUserNote.objects.create(user=self.target, note="Vaktmester")
        self.assertResponseNoErrors(self.update_nfc({"note": ""}))
        self.assertIsNone(self.note())

    def test_removing_permanent_access_removes_the_note(self):
        self.give_card(permanent=True)
        NfcUserNote.objects.create(user=self.target, note="Vaktmester")
        self.assertResponseNoErrors(self.update_nfc({"permanentAccess": False}))
        self.assertIsNone(self.note())

    def test_a_replaced_card_keeps_the_note(self):
        self.give_card(permanent=True)
        NfcUserNote.objects.create(user=self.target, note="Vaktmester")
        self.assertResponseNoErrors(self.update_nfc({"mifareCsn": "1234567899", "permanentAccess": True}))
        assignment = NfcCardAssignment.objects.get(user=self.target, revoked_at__isnull=True)
        self.assertEqual(assignment.card.mifare_csn, "1234567899")
        self.assertTrue(assignment.permanent_access)
        self.assertEqual(self.note().note, "Vaktmester")


class PermanentAccessHistoryTests(NfcPermissionBase):
    HISTORY = (
        "query L($id: ID!) { nfcUser(id: $id) { nfcPermanentAccessHistory { given changedBy reason changedAt } } }"
    )

    def changes(self, user=None):
        return list(
            NfcPermanentAccessChange.objects.filter(user=user or self.target)
            .order_by("pk")
            .values_list("given", "changed_by", "reason")
        )

    def test_giving_and_removing_is_recorded_with_who_did_it(self):
        self.give_card(permanent=False)
        self.assertResponseNoErrors(self.update_nfc({"permanentAccess": True}))
        self.assertResponseNoErrors(self.update_nfc({"permanentAccess": False}))
        self.assertEqual(self.changes(), [(True, self.nfc_admin.pk, ""), (False, self.nfc_admin.pk, "")])

    def test_saving_without_a_change_records_nothing(self):
        self.give_card(permanent=True)
        self.assertResponseNoErrors(self.update_nfc({"permanentAccess": True, "pinCode": "1111"}))
        self.assertEqual(self.changes(), [])

    def test_a_save_that_fails_records_nothing(self):
        assignment = self.give_card(permanent=False)
        too_long = "x" * (NfcUserNote.MAX_LENGTH + 1)
        self.assertResponseHasErrors(self.update_nfc({"permanentAccess": True, "note": too_long}))
        assignment.refresh_from_db()
        self.assertFalse(assignment.permanent_access)
        self.assertEqual(self.changes(), [])

    def test_a_new_card_with_the_access_kept_is_no_change(self):
        self.give_card(permanent=True)
        self.assertResponseNoErrors(self.update_nfc({"mifareCsn": "1234567899", "permanentAccess": True}))
        self.assertEqual(self.changes(), [])

    def test_a_new_card_without_the_access_is_recorded(self):
        self.give_card(permanent=True)
        NfcUserNote.objects.create(user=self.target, note="Vaktmester")
        self.assertResponseNoErrors(self.update_nfc({"mifareCsn": "1234567899"}))
        self.assertEqual(self.changes(), [(False, self.nfc_admin.pk, "")])
        self.assertFalse(NfcUserNote.objects.filter(user=self.target).exists())

    def test_taking_someone_elses_card_is_recorded_for_them(self):
        holder = IndokUserFactory()
        self.give_card(user=holder, csn="1234567899", permanent=True)
        NfcUserNote.objects.create(user=holder, note="Vaktmester")

        self.assertResponseNoErrors(self.update_nfc({"mifareCsn": "1234567899"}))

        self.assertEqual(
            self.changes(holder),
            [(False, self.nfc_admin.pk, "Kortet ble flyttet til en annen bruker")],
        )
        self.assertEqual(self.changes(), [])
        self.assertTrue(NfcUserNote.objects.filter(user=holder).exists())

    def test_django_admin_changes_are_recorded(self):
        superuser = UserFactory(is_staff=True, is_superuser=True)
        request = RequestFactory().post("/")
        request.user = superuser
        model_admin = admin.site._registry[NfcCardAssignment]
        reason = "Endret i Django admin"

        assignment = self.give_card(permanent=False)
        assignment.permanent_access = True
        model_admin.save_model(request, assignment, form=None, change=True)
        self.assertEqual(self.changes(), [(True, superuser.pk, reason)])

        model_admin.save_model(request, assignment, form=None, change=True)
        self.assertEqual(len(self.changes()), 1)

        model_admin.delete_model(request, assignment)
        self.assertEqual(self.changes()[-1], (False, superuser.pk, reason))

        other = IndokUserFactory()
        self.give_card(user=other, csn="1234567899", permanent=True)
        model_admin.delete_queryset(request, NfcCardAssignment.objects.filter(user=other))
        self.assertEqual(self.changes(other), [(False, superuser.pk, reason)])

    def test_moving_a_card_with_permanent_access_in_django_admin_is_recorded_for_both(self):
        superuser = UserFactory(is_superuser=True, is_staff=True)
        request = RequestFactory().post("/")
        request.user = superuser
        model_admin = admin.site._registry[NfcCardAssignment]
        reason = "Endret i Django admin"
        new_owner = IndokUserFactory()

        assignment = self.give_card(permanent=True)
        NfcPermanentAccessChange.objects.all().delete()
        assignment.user = new_owner
        model_admin.save_model(request, assignment, form=None, change=True)

        self.assertEqual(self.changes(), [(False, superuser.pk, reason)])
        self.assertEqual(self.changes(new_owner), [(True, superuser.pk, reason)])

    def test_door_admins_see_the_history_newest_first(self):
        self.give_card(permanent=False)
        self.nfc_admin.first_name, self.nfc_admin.last_name = "Dør", "Admin"
        self.nfc_admin.save(update_fields=["first_name", "last_name"])
        self.update_nfc({"permanentAccess": True})
        self.update_nfc({"permanentAccess": False})

        response = self.query(
            self.HISTORY, user=self.nfc_admin, operation_name="L", variables={"id": str(self.target.id)}
        )
        history = self.data(response, "nfcUser")["nfcPermanentAccessHistory"]
        self.assertEqual([change["given"] for change in history], [False, True])
        self.assertEqual(history[0]["changedBy"], "Dør Admin")

    def test_the_person_and_others_do_not_see_the_history(self):
        self.give_card(permanent=False)
        self.update_nfc({"permanentAccess": True})
        own = self.query("query { user { nfcPermanentAccessHistory { given } } }", user=self.target)
        self.assertEqual(self.data(own, "user"), {"nfcPermanentAccessHistory": None})

        other = self.query(self.HISTORY, user=self.no_access, operation_name="L", variables={"id": str(self.target.id)})
        self.assertResponseHasErrors(other)

    def test_the_history_goes_with_the_person(self):
        self.give_card(permanent=False)
        self.update_nfc({"permanentAccess": True})
        target_id = self.target.pk
        self.target.delete()
        self.assertFalse(NfcPermanentAccessChange.objects.filter(user_id=target_id).exists())
