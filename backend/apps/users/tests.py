import json
from datetime import datetime

from django.contrib.auth import get_user_model
from django.utils import timezone
from graphene.utils.str_converters import to_snake_case
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import IndokUserFactory, UserFactory


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
            if type(value) == datetime:
                self.assertEqual(v, str(value.isoformat()))
                continue
            self.assertEqual(str(v), str(value))


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
        return super().setUp()

    def test_auth_user(self):
        pass

    def test_update_graduation_year(self):

        today = timezone.now().year
        query = self.mutation(today + 1)
        res = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(today + 1, get_user_model().objects.get(pk=self.indok_user.id).graduation_year)

    def test_prevent_graduation_year_update(self):
        today = timezone.now().year
        query = self.mutation(today + 1)
        res = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(today + 1, get_user_model().objects.get(pk=self.indok_user.id).graduation_year)

        query = self.mutation(today + 2)
        res = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(res)
        self.assertEqual(today + 1, get_user_model().objects.get(pk=self.indok_user.id).graduation_year)

    def test_update_user(self):
        pass

    def test_invalid_update_user(self):
        pass

    def test_get_id_token(self):
        pass
