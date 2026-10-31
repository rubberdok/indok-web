import json
from datetime import datetime
from typing import Callable, cast
from unittest.mock import patch

import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.utils import timezone
from graphene.utils.str_converters import to_snake_case
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import IndokUserFactory, UserFactory

from apps.nfc.models import NfcCard, NfcCardAssignment, NfcSettings

User = get_user_model()

ADMIN_UPDATE_USER_NFC_MUTATION = """
    mutation AdminUpdateUserNfc($userId: ID!, $nfcData: AdminUserNfcInput!) {
        adminUpdateUserNfc(userId: $userId, nfcData: $nfcData) {
            user {
                id
            }
        }
    }
"""


def setup_mock_requests(
    first_name: str = "Test",
    last_name: str = "Testesen",
    indok: bool = True,
    id: str = "123123",
) -> Callable:
    def mocked_feide_requests(*args, **kwargs):
        class MockResponse:
            def __init__(self, json_data, status_code: int) -> None:
                self.json_data = json_data
                self.status_code = status_code

            def json(self):
                return self.json_data

            def raise_for_status(self):
                if self.status_code in range(400, 600):
                    raise requests.exceptions.RequestException("Error")

        if args[0] == "https://auth.dataporten.no/oauth/token":
            return MockResponse(
                {
                    "access_token": "1234567890",
                    "id_token": "1234567890",
                    "expires_in": 3600,
                    "token_type": "Bearer",
                },
                200,
            )

        if args[0] == "https://auth.dataporten.no/openid/userinfo":
            return MockResponse(
                {
                    "sub": id,
                    "name": f"{first_name} {last_name}",
                    "email": f"{first_name.lower()}@stud.ntnu.no",
                    "dataporten-userid_sec": [f"feide:{first_name.lower()}@ntnu.no"],
                },
                200,
            )

        if args[0] == "https://groups-api.dataporten.no/groups/me/groups/fc:fs:fs:prg:ntnu.no:MTIØT":
            if indok:
                return MockResponse(
                    {
                        "basic": "member",
                        "active": True,
                    },
                    200,
                )
            return MockResponse({}, 200)

    return mocked_feide_requests


class UsersBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()

        # Create three (logged in) users
        self.indok_user = IndokUserFactory(graduation_year=timezone.now().year + 3)
        self.super_user = UserFactory(is_staff=True, is_superuser=True)


class UsersResolversTestCase(UsersBaseTestCase):
    """
    Testing all resolvers for users
    """

    def test_resolve_all_users(self):
        query = """
                query {
                    allUsers {
                        id
                        feideEmail
                        email
                        username
                        firstName
                        lastName
                        dateJoined
                        graduationYear
                        gradeYear
                        allergies
                        phoneNumber
                        firstLogin
                        events {
                            id
                        }
                        organizations {
                            id
                            name
                        }
                    }
                }
                """

        # Unauthorized users should not be able to retrieve all users
        response = self.query(query)
        self.assertResponseHasErrors(response)

        # Fetching content of response
        content = json.loads(response.content)

        # Should not leak any user data
        self.assertIsNone(content["data"]["allUsers"])

        # Regular logged in users users should not be able to retrieve all users
        response = self.query(query, user=self.indok_user)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertIsNone(content["data"]["allUsers"])

        # Only super users (is_staffmember) should be able to retrieve all users
        response = self.query(query, user=self.super_user)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        # There are three users in the database (AnonymousUser, self.indok_user and self.super_user)
        self.assertEqual(len(content["data"]["allUsers"]), 3)

    def test_resolve_user(self):
        query = """
                query {
                    user {
                        id
                        feideEmail
                        email
                        username
                        firstName
                        lastName
                        dateJoined
                        graduationYear
                        gradeYear
                        allergies
                        phoneNumber
                        firstLogin
                    }
                }
                """

        # Unauthorized users should retrieve None
        response = self.query(query)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        self.assertIsNone(content["data"]["user"])

        # Logged in users should retrieve their user data
        response = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        # Confirm content of query
        # TODO: Should look into better ways of doing this assertion
        for k, v in content["data"]["user"].items():
            value = getattr(self.indok_user, to_snake_case(k))
            if isinstance(value, datetime):
                self.assertEqual(v, str(value.isoformat()))
                continue
            self.assertEqual(str(v), str(value))

    def test_nfc_user_fields_use_active_assignment_and_hide_other_users_from_staff(self):
        card = NfcCard.objects.create(mifare_csn="1234567893")
        NfcCardAssignment.objects.create(card=card, user=self.indok_user, pin_code="4321", permanent_access=True)
        own_response = self.query(
            "query { user { nfcMifareCsn nfcCardNumber nfcHasPin nfcPermanentAccess } }",
            user=self.indok_user,
        )
        self.assertResponseNoErrors(own_response)
        own_fields = json.loads(own_response.content)["data"]["user"]
        self.assertEqual(own_fields["nfcMifareCsn"], card.mifare_csn)
        self.assertTrue(own_fields["nfcHasPin"])
        self.assertTrue(own_fields["nfcPermanentAccess"])

        staff = UserFactory(is_staff=True)
        staff_response = self.query(
            "query { allUsers { id nfcMifareCsn nfcCardNumber nfcHasPin nfcPermanentAccess } }",
            user=staff,
        )
        self.assertResponseNoErrors(staff_response)
        other_user_fields = next(
            user
            for user in json.loads(staff_response.content)["data"]["allUsers"]
            if user["id"] == str(self.indok_user.id)
        )
        self.assertEqual(
            (
                other_user_fields["nfcMifareCsn"],
                other_user_fields["nfcCardNumber"],
                other_user_fields["nfcHasPin"],
                other_user_fields["nfcPermanentAccess"],
            ),
            (None, None, None, None),
        )

    def test_resolve_user_search(self):
        query = """
            query SearchUsers($query: String!) {
                userSearch(query: $query) {
                    id
                    username
                }
            }
        """

        response = self.query(
            query,
            operation_name="SearchUsers",
            variables={"query": self.indok_user.username},
        )
        self.assertResponseHasErrors(response)

        response = self.query(
            query,
            user=self.super_user,
            operation_name="SearchUsers",
            variables={"query": self.indok_user.username},
        )
        self.assertResponseNoErrors(response)
        data = response.json()["data"]["userSearch"]
        self.assertTrue(any(user["username"] == self.indok_user.username for user in data))

        permission = Permission.objects.get(codename="manage_user_profiles")
        self.indok_user.user_permissions.add(permission)

        response = self.query(
            query,
            user=self.indok_user,
            operation_name="SearchUsers",
            variables={"query": self.super_user.username},
        )
        self.assertResponseNoErrors(response)
        data = response.json()["data"]["userSearch"]
        self.assertTrue(any(user["username"] == self.super_user.username for user in data))

    def test_profile_permission_allows_nfc_user_search(self):
        query = """
            query SearchNfcUsers($query: String!) {
                nfcUserSearch(query: $query) {
                    id
                    username
                }
            }
        """

        response = self.query(
            query,
            user=self.indok_user,
            operation_name="SearchNfcUsers",
            variables={"query": "test"},
        )
        self.assertResponseHasErrors(response)

        permission = Permission.objects.get(codename="manage_user_profiles")
        self.indok_user.user_permissions.add(permission)

        response = self.query(
            query,
            user=self.indok_user,
            operation_name="SearchNfcUsers",
            variables={"query": self.super_user.username},
        )
        self.assertResponseNoErrors(response)
        data = response.json()["data"]["nfcUserSearch"]
        self.assertTrue(any(user["username"] == self.super_user.username for user in data))

    def test_nfc_user_search_costs_the_same_for_many_users(self):
        """The four nfc fields used to cost four queries per user found."""
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        from apps.nfc.models import NfcCard

        query = """
            query SearchNfcUsers($query: String!) {
                nfcUserSearch(query: $query) {
                    id
                    nfcMifareCsn
                    nfcCardNumber
                    nfcHasPin
                    nfcPermanentAccess
                }
            }
        """

        def search_with(count):
            for i in range(count):
                user = UserFactory(username=f"nplusone{count}x{i}")
                card = NfcCard.objects.create(mifare_csn=f"{count * 100 + i:010d}")
                NfcCardAssignment.objects.create(card=card, user=user, pin_code="1234")
            with CaptureQueriesContext(connection) as queries:
                response = self.query(
                    query,
                    user=self.super_user,
                    operation_name="SearchNfcUsers",
                    variables={"query": f"nplusone{count}x"},
                )
            self.assertResponseNoErrors(response)
            found = response.json()["data"]["nfcUserSearch"]
            self.assertEqual(len(found), count)
            self.assertTrue(all(user["nfcHasPin"] for user in found))
            return len(queries)

        search_with(1)  # warms caches that are filled once per test
        self.assertEqual(search_with(2), search_with(5))


class UsersMutationsTestCase(UsersBaseTestCase):
    """
    Testing all mutations for users
    """

    def setUp(self) -> None:
        self.mutation = (
            lambda year: f"""
            mutation {{
                updateUser(userData: {{
                    graduationYear: {year}
                }}) {{
                    user {{
                        graduationYear
                    }}
                }}
            }}
        """
        )
        self.auth_user_mutation = """
            mutation auth {
                authUser(code: "mocked") {
                    user {
                        id
                        username
                        firstName
                        lastName
                        email
                        feideEmail
                        firstLogin
                        yearUpdatedAt
                        feideUserid
                    }
                }
            }
        """
        self.registered_indok_user = IndokUserFactory(feide_userid="a random ID", first_login=False)
        return super().setUp()

    @patch("requests.get", side_effect=setup_mock_requests())
    @patch("requests.post", side_effect=setup_mock_requests())
    @patch("api.auth.dataporten_auth.DataportenAuth.validate_response", return_value=None)
    def test_register_new_indok_user(self, *args, **kwargs):
        response = self.query(self.auth_user_mutation)
        self.assertResponseNoErrors(response)

        user = response.json()["data"]["authUser"]["user"]
        pk = user["id"]

        self.deep_assert_equal(user, current_user := User.objects.get(pk=pk))
        self.assertTrue(user["firstLogin"], "First login should be set to True")
        self.assertEqual(user["username"], "test")
        self.assertEqual(user["firstName"], "Test")
        self.assertEqual(user["lastName"], "Testesen")

        cookies = response.client.cookies
        self.assertIn("sessionid", cookies)

        self.assertTrue(current_user.groups.filter(name="Indøk").exists())
        self.assertTrue(current_user.groups.filter(name="Registered user").exists())

    @patch("requests.get", side_effect=setup_mock_requests(indok=False))
    @patch("requests.post", side_effect=setup_mock_requests(indok=False))
    @patch("api.auth.dataporten_auth.DataportenAuth.validate_response", return_value=None)
    def test_register_new_non_indok_user(self, *args, **kwargs):
        response = self.query(self.auth_user_mutation)
        self.assertResponseNoErrors(response)

        user = response.json()["data"]["authUser"]["user"]
        pk = user["id"]

        self.deep_assert_equal(user, current_user := User.objects.get(pk=pk))
        self.assertTrue(user["firstLogin"], "First login should be set to True")
        self.assertEqual(user["username"], "test")
        self.assertEqual(user["firstName"], "Test")
        self.assertEqual(user["lastName"], "Testesen")

        cookies = response.client.cookies
        self.assertIn("sessionid", cookies)

        self.assertTrue(not current_user.groups.filter(name="Indøk").exists())
        self.assertTrue(current_user.groups.filter(name="Registered user").exists())

    @patch("requests.get", side_effect=setup_mock_requests(id="a random ID"))
    @patch("requests.post", side_effect=setup_mock_requests(id="a random ID"))
    @patch("api.auth.dataporten_auth.DataportenAuth.validate_response", return_value=None)
    def test_registered_user_authentication(self, *args, **kwargs):
        response = self.query(self.auth_user_mutation)
        self.assertResponseNoErrors(response)

        user = response.json()["data"]["authUser"]["user"]

        self.deep_assert_equal(user, self.registered_indok_user)
        self.assertFalse(user["firstLogin"], "First login should be set to False")

        cookies = response.client.cookies
        self.assertIn("sessionid", cookies)

    def test_logout(self):
        logout = """
            mutation {
                logout {
                    idToken
                }
            }
        """
        response = self.query(logout, user=self.registered_indok_user)
        self.assertResponseNoErrors(response)
        id_token = response.json()["data"]["logout"]["idToken"]
        self.assertEqual(id_token, self.registered_indok_user.id_token)

    def test_update_graduation_year(self):
        today = timezone.now().year
        query = self.mutation(today + 1)
        res = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(
            today + 1,
            getattr(get_user_model().objects.get(pk=self.indok_user.id), "graduation_year"),
        )

    def test_prevent_graduation_year_update(self):
        today = timezone.now().year
        query = self.mutation(today + 1)
        res = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(
            today + 1,
            getattr(get_user_model().objects.get(pk=self.indok_user.id), "graduation_year"),
        )

        query = self.mutation(today + 2)
        res = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(
            today + 1,
            getattr(get_user_model().objects.get(pk=self.indok_user.id), "graduation_year"),
        )

    def test_update_graduation_year_after_registering(self):
        newly_registered_user = IndokUserFactory(first_login=True, graduation_year=timezone.now().year + 3)
        today = timezone.now().year
        query = self.mutation(today + 1)
        res = self.query(query, user=newly_registered_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(
            today + 1,
            getattr(
                get_user_model().objects.get(pk=newly_registered_user.id),
                "graduation_year",
            ),
        )

        query = self.mutation(today + 2)
        res = self.query(query, user=newly_registered_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(
            today + 2,
            getattr(
                get_user_model().objects.get(pk=newly_registered_user.id),
                "graduation_year",
            ),
        )

    def test_update_user(self):
        mutation = """
            mutation AdminUpdateUser($userId: ID!, $userData: AdminUserInput!) {
                adminUpdateUser(userId: $userId, userData: $userData) {
                    user {
                        id
                        firstName
                        lastName
                        phoneNumber
                    }
                }
            }
        """

        response = self.query(
            mutation,
            user=self.super_user,
            operation_name="AdminUpdateUser",
            variables={
                "userId": str(self.indok_user.id),
                "userData": {
                    "firstName": "Oppdatert",
                    "lastName": "Bruker",
                    "phoneNumber": "+4791234567",
                },
            },
        )
        self.assertResponseNoErrors(response)

        self.indok_user.refresh_from_db()
        self.assertEqual(self.indok_user.first_name, "Oppdatert")
        self.assertEqual(self.indok_user.last_name, "Bruker")

    def test_admin_can_update_nfc_card_pin_and_permanent_access(self):
        response = self.query(
            ADMIN_UPDATE_USER_NFC_MUTATION,
            user=self.super_user,
            operation_name="AdminUpdateUserNfc",
            variables={
                "userId": str(self.indok_user.id),
                "nfcData": {
                    "mifareCsn": "14392683656882692",
                    "pinCode": "4321",
                    "permanentAccess": True,
                },
            },
        )
        self.assertResponseNoErrors(response)

        assignment = NfcCardAssignment.objects.get(user=self.indok_user, revoked_at__isnull=True)
        self.assertEqual(assignment.card.mifare_csn, "3434850820")
        self.assertEqual(assignment.card.card_number, "14392683656882692")
        self.assertEqual(assignment.pin_code, "4321")
        self.assertTrue(assignment.permanent_access)

    def test_admin_nfc_card_reassignment_revokes_old_card_assignments(self):
        old_card = NfcCard.objects.create(mifare_csn="1234567890")
        old_assignment = NfcCardAssignment.objects.create(card=old_card, user=self.indok_user, pin_code="4321")
        other_user = UserFactory()
        new_card = NfcCard.objects.create(mifare_csn="3434850820")
        other_assignment = NfcCardAssignment.objects.create(card=new_card, user=other_user, pin_code="1234")

        response = self.query(
            ADMIN_UPDATE_USER_NFC_MUTATION,
            user=self.super_user,
            operation_name="AdminUpdateUserNfc",
            variables={
                "userId": str(self.indok_user.id),
                "nfcData": {"mifareCsn": "14392683656882692"},
            },
        )
        self.assertResponseNoErrors(response)

        old_assignment.refresh_from_db()
        other_assignment.refresh_from_db()
        current_assignment = NfcCardAssignment.objects.get(user=self.indok_user, revoked_at__isnull=True)
        self.assertIsNotNone(old_assignment.revoked_at)
        self.assertIsNotNone(other_assignment.revoked_at)
        self.assertEqual(current_assignment.card_id, new_card.id)
        self.assertEqual(current_assignment.card.card_number, "14392683656882692")

    def test_admin_nfc_update_requires_permission_target_and_fields(self):
        variables = {
            "userId": str(self.indok_user.id),
            "nfcData": {"mifareCsn": "1234567890"},
        }
        denied = self.query(
            ADMIN_UPDATE_USER_NFC_MUTATION,
            user=self.indok_user,
            operation_name="AdminUpdateUserNfc",
            variables=variables,
        )
        self.assertResponseHasErrors(denied)

        missing_user = self.query(
            ADMIN_UPDATE_USER_NFC_MUTATION,
            user=self.super_user,
            operation_name="AdminUpdateUserNfc",
            variables={"userId": "99999999", "nfcData": {"mifareCsn": "1234567890"}},
        )
        self.assertResponseHasErrors(missing_user)

        empty_input = self.query(
            ADMIN_UPDATE_USER_NFC_MUTATION,
            user=self.super_user,
            operation_name="AdminUpdateUserNfc",
            variables={"userId": str(self.indok_user.id), "nfcData": {}},
        )
        self.assertResponseHasErrors(empty_input)

    def test_admin_nfc_update_rejects_empty_card_invalid_pin_and_missing_assignment(self):
        for nfc_data in ({"mifareCsn": ""}, {"pinCode": "4321"}, {"permanentAccess": True}):
            with self.subTest(nfc_data=nfc_data):
                response = self.query(
                    ADMIN_UPDATE_USER_NFC_MUTATION,
                    user=self.super_user,
                    operation_name="AdminUpdateUserNfc",
                    variables={"userId": str(self.indok_user.id), "nfcData": nfc_data},
                )
                self.assertResponseHasErrors(response)

        NfcCardAssignment.objects.create(
            card=NfcCard.objects.create(mifare_csn="1234567890"),
            user=self.indok_user,
            pin_code="4321",
        )
        invalid_pin = self.query(
            ADMIN_UPDATE_USER_NFC_MUTATION,
            user=self.super_user,
            operation_name="AdminUpdateUserNfc",
            variables={"userId": str(self.indok_user.id), "nfcData": {"pinCode": "12345"}},
        )
        self.assertResponseHasErrors(invalid_pin)

    def test_self_service_pin_requires_a_card_and_accepts_only_ascii_digits(self):
        mutation = """
            mutation UpdateOwnUserNfc($userData: UserInput) {
                updateUser(userData: $userData) {
                    user { id }
                }
            }
        """
        variables = {"userData": {"nfcPinCode": "4321"}}
        without_card = self.query(
            mutation,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables=variables,
        )
        self.assertResponseHasErrors(without_card)

        assignment = NfcCardAssignment.objects.create(
            card=NfcCard.objects.create(mifare_csn="1234567893"),
            user=self.indok_user,
            pin_code="4321",
        )
        invalid_digits = self.query(
            mutation,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables={"userData": {"nfcPinCode": "١٢٣٤"}},
        )
        self.assertResponseHasErrors(invalid_digits)
        assignment.refresh_from_db()
        self.assertEqual(assignment.pin_code, "4321")

        valid = self.query(
            mutation,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables={"userData": {"nfcPinCode": "9876"}},
        )
        self.assertResponseNoErrors(valid)
        assignment.refresh_from_db()
        self.assertEqual(assignment.pin_code, "9876")

    def test_invalid_update_user(self):
        pass

    def test_get_id_token(self):
        pass

    def test_update_user_nfc_mifare_csn_requires_self_service_flag(self):
        settings_obj = NfcSettings.objects.create()
        settings_obj.allow_user_mifare_csn_self_service = False
        settings_obj.save(update_fields=["allow_user_mifare_csn_self_service"])

        mutation = """
            mutation UpdateOwnUserNfc($userData: UserInput) {
                updateUser(userData: $userData) {
                    user {
                        id
                    }
                }
            }
        """

        response = self.query(
            mutation,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcMifareCsn": "1234 567 890",
                },
            },
        )
        self.assertResponseHasErrors(response)
        content = response.json()
        self.assertIn(
            "Egenregistrering av kortnummer er deaktivert",
            content["errors"][0]["message"],
        )
        self.assertFalse(NfcCardAssignment.objects.filter(user=self.indok_user, revoked_at__isnull=True).exists())

    def test_update_user_nfc_mifare_csn_when_self_service_enabled(self):
        self.indok_user.first_name = "Ola"
        self.indok_user.last_name = "Nordmann"
        self.indok_user.save(update_fields=["first_name", "last_name"])

        settings_obj = NfcSettings.objects.create()
        settings_obj.allow_user_mifare_csn_self_service = True
        settings_obj.save(update_fields=["allow_user_mifare_csn_self_service"])

        mutation = """
            mutation UpdateOwnUserNfc($userData: UserInput) {
                updateUser(userData: $userData) {
                    user {
                        id
                    }
                }
            }
        """

        response = self.query(
            mutation,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcMifareCsn": "1234 567 890",
                },
            },
        )
        self.assertResponseNoErrors(response)

        assignment = (
            NfcCardAssignment.objects.filter(
                user=self.indok_user,
                revoked_at__isnull=True,
            )
            .select_related("card")
            .first()
        )
        if assignment is None:
            self.fail("Expected active NFC assignment after self-service card update")
        assignment = cast(NfcCardAssignment, assignment)
        self.assertEqual(assignment.card.mifare_csn, "1234567890")
        self.assertEqual(assignment.card.label, "Ola Nordmann sitt kort (E)")

    def test_update_user_nfc_mifare_csn_converts_printed_uid_to_door_number(self):
        settings_obj = NfcSettings.objects.create()
        settings_obj.allow_user_mifare_csn_self_service = True
        settings_obj.save(update_fields=["allow_user_mifare_csn_self_service"])

        mutation = """
            mutation UpdateOwnUserNfc($userData: UserInput) {
                updateUser(userData: $userData) {
                    user {
                        id
                    }
                }
            }
        """

        response = self.query(
            mutation,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcMifareCsn": "14392683656882692",  # made-up UID 04 AA BB CC 11 22 33
                },
            },
        )
        self.assertResponseNoErrors(response)

        assignment = (
            NfcCardAssignment.objects.filter(
                user=self.indok_user,
                revoked_at__isnull=True,
            )
            .select_related("card")
            .first()
        )
        if assignment is None:
            self.fail("Expected active NFC assignment after UID conversion")
        assignment = cast(NfcCardAssignment, assignment)
        self.assertEqual(assignment.card.mifare_csn, "3434850820")
        self.assertEqual(assignment.card.card_number, "14392683656882692")

    def test_reentering_the_same_card_remembers_its_printed_uid(self):
        card = NfcCard.objects.create(mifare_csn="3434850820")
        NfcCardAssignment.objects.create(card=card, user=self.indok_user, pin_code="4321")
        mutation = """
            mutation UpdateOwnUserNfc($userData: UserInput) {
                updateUser(userData: $userData) {
                    user { id }
                }
            }
        """
        response = self.query(
            mutation,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables={"userData": {"nfcMifareCsn": "14392683656882692"}},
        )
        self.assertResponseNoErrors(response)
        card.refresh_from_db()
        self.assertEqual(card.card_number, "14392683656882692")

    def test_update_user_nfc_mifare_csn_can_only_be_set_once(self):
        settings_obj = NfcSettings.objects.create()
        settings_obj.allow_user_mifare_csn_self_service = True
        settings_obj.save(update_fields=["allow_user_mifare_csn_self_service"])

        mutation = """
            mutation UpdateOwnUserNfc($userData: UserInput) {
                updateUser(userData: $userData) {
                    user {
                        id
                    }
                }
            }
        """

        first_response = self.query(
            mutation,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcMifareCsn": "1234567890",
                },
            },
        )
        self.assertResponseNoErrors(first_response)

        second_response = self.query(
            mutation,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcMifareCsn": "1234567891",
                },
            },
        )
        self.assertResponseHasErrors(second_response)

    def test_revoked_card_assignment_still_prevents_self_service_reassignment(self):
        NfcSettings.objects.create(allow_user_mifare_csn_self_service=True)
        card = NfcCard.objects.create(mifare_csn="1234567890")
        assignment = NfcCardAssignment.objects.create(card=card, user=self.indok_user, pin_code="4321")
        assignment.revoke(reason="Card replaced")
        response = self.query(
            """
                mutation UpdateOwnUserNfc($userData: UserInput) {
                    updateUser(userData: $userData) { user { id } }
                }
            """,
            user=self.indok_user,
            operation_name="UpdateOwnUserNfc",
            variables={"userData": {"nfcMifareCsn": "1234567891"}},
        )
        self.assertResponseHasErrors(response)
        self.assertIn("Du kan bare registrere kortnummer én gang", response.json()["errors"][0]["message"])
        self.assertFalse(NfcCardAssignment.objects.filter(user=self.indok_user, revoked_at__isnull=True).exists())
