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

from apps.nfc.models import NfcCardAssignment, NfcSettings

User = get_user_model()


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

        if (
            args[0]
            == "https://groups-api.dataporten.no/groups/me/groups/fc:fs:fs:prg:ntnu.no:MTIØT"
        ):
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
            query, op_name="SearchUsers", variables={"query": self.indok_user.username}
        )
        self.assertResponseHasErrors(response)

        response = self.query(
            query,
            user=self.super_user,
            op_name="SearchUsers",
            variables={"query": self.indok_user.username},
        )
        self.assertResponseNoErrors(response)
        data = response.json()["data"]["userSearch"]
        self.assertTrue(
            any(user["username"] == self.indok_user.username for user in data)
        )

        permission = Permission.objects.get(codename="manage_user_profiles")
        self.indok_user.user_permissions.add(permission)

        response = self.query(
            query,
            user=self.indok_user,
            op_name="SearchUsers",
            variables={"query": self.super_user.username},
        )
        self.assertResponseNoErrors(response)
        data = response.json()["data"]["userSearch"]
        self.assertTrue(
            any(user["username"] == self.super_user.username for user in data)
        )

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
            op_name="SearchNfcUsers",
            variables={"query": "test"},
        )
        self.assertResponseHasErrors(response)

        permission = Permission.objects.get(codename="manage_user_profiles")
        self.indok_user.user_permissions.add(permission)

        response = self.query(
            query,
            user=self.indok_user,
            op_name="SearchNfcUsers",
            variables={"query": self.super_user.username},
        )
        self.assertResponseNoErrors(response)
        data = response.json()["data"]["nfcUserSearch"]
        self.assertTrue(
            any(user["username"] == self.super_user.username for user in data)
        )


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
        self.registered_indok_user = IndokUserFactory(
            feide_userid="a random ID", first_login=False
        )
        return super().setUp()

    @patch("requests.get", side_effect=setup_mock_requests())
    @patch("requests.post", side_effect=setup_mock_requests())
    @patch(
        "api.auth.dataporten_auth.DataportenAuth.validate_response", return_value=None
    )
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
    @patch(
        "api.auth.dataporten_auth.DataportenAuth.validate_response", return_value=None
    )
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
    @patch(
        "api.auth.dataporten_auth.DataportenAuth.validate_response", return_value=None
    )
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
            get_user_model().objects.get(pk=self.indok_user.id).graduation_year,
        )

    def test_prevent_graduation_year_update(self):
        today = timezone.now().year
        query = self.mutation(today + 1)
        res = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(
            today + 1,
            get_user_model().objects.get(pk=self.indok_user.id).graduation_year,
        )

        query = self.mutation(today + 2)
        res = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(
            today + 1,
            get_user_model().objects.get(pk=self.indok_user.id).graduation_year,
        )

    def test_update_graduation_year_after_registering(self):
        newly_registered_user = IndokUserFactory(
            first_login=True, graduation_year=timezone.now().year + 3
        )
        today = timezone.now().year
        query = self.mutation(today + 1)
        res = self.query(query, user=newly_registered_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(
            today + 1,
            get_user_model().objects.get(pk=newly_registered_user.id).graduation_year,
        )

        query = self.mutation(today + 2)
        res = self.query(query, user=newly_registered_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(
            today + 2,
            get_user_model().objects.get(pk=newly_registered_user.id).graduation_year,
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
            op_name="AdminUpdateUser",
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

    def test_invalid_update_user(self):
        pass

    def test_get_id_token(self):
        pass

    def test_update_user_nfc_uid_requires_self_service_flag(self):
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
            op_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcUidHex": "04 A1 B2 C3 D4 E5 F6",
                },
            },
        )
        self.assertResponseHasErrors(response)
        self.assertFalse(
            NfcCardAssignment.objects.filter(
                user=self.indok_user, revoked_at__isnull=True
            ).exists()
        )

    def test_update_user_nfc_uid_when_self_service_enabled(self):
        self.indok_user.first_name = "Ola"
        self.indok_user.last_name = "Nordmann"
        self.indok_user.save(update_fields=["first_name", "last_name"])

        settings_obj = NfcSettings.objects.create()
        settings_obj.allow_user_uid_self_service = True
        settings_obj.allow_7_byte_uid = True
        settings_obj.allow_4_byte_uid = False
        settings_obj.save(update_fields=["allow_user_uid_self_service", "allow_7_byte_uid", "allow_4_byte_uid"])

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
            op_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcUidHex": "04 A1 B2 C3 D4 E5 F6",
                },
            },
        )
        self.assertResponseNoErrors(response)

        assignment = NfcCardAssignment.objects.filter(
            user=self.indok_user,
            revoked_at__isnull=True,
        ).select_related("card").first()
        if assignment is None:
            self.fail("Expected active NFC assignment after self-service UID update")
        assignment = cast(NfcCardAssignment, assignment)
        self.assertEqual(assignment.card.uid_hex, "04A1B2C3D4E5F6")
        self.assertEqual(assignment.card.label, "Ola Nordmann sitt kort (E)")

    def test_update_user_nfc_uid_with_4_byte_policy(self):
        settings_obj = NfcSettings.objects.create()
        settings_obj.allow_user_uid_self_service = True
        settings_obj.allow_7_byte_uid = False
        settings_obj.allow_4_byte_uid = True
        settings_obj.save(update_fields=["allow_user_uid_self_service", "allow_7_byte_uid", "allow_4_byte_uid"])

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
            op_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcUidHex": "A1-B2-C3-D4",
                },
            },
        )
        self.assertResponseNoErrors(response)

        assignment = NfcCardAssignment.objects.filter(
            user=self.indok_user,
            revoked_at__isnull=True,
        ).select_related("card").first()
        if assignment is None:
            self.fail("Expected active NFC assignment for 4-byte UID policy")
        assignment = cast(NfcCardAssignment, assignment)
        self.assertEqual(assignment.card.uid_hex, "A1B2C3D4")

    def test_update_user_nfc_uid_can_only_be_set_once(self):
        settings_obj = NfcSettings.objects.create()
        settings_obj.allow_user_uid_self_service = True
        settings_obj.allow_7_byte_uid = True
        settings_obj.allow_4_byte_uid = False
        settings_obj.save(update_fields=["allow_user_uid_self_service", "allow_7_byte_uid", "allow_4_byte_uid"])

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
            op_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcUidHex": "04A1B2C3D4E5F6",
                },
            },
        )
        self.assertResponseNoErrors(first_response)

        second_response = self.query(
            mutation,
            user=self.indok_user,
            op_name="UpdateOwnUserNfc",
            variables={
                "userData": {
                    "nfcUidHex": "04A1B2C3D4E5F7",
                },
            },
        )
        self.assertResponseHasErrors(second_response)
