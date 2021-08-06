import json
from datetime import datetime

from graphene.utils.str_converters import to_snake_case

from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from utils.testing.factories.users import UserFactory


class UsersBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()

        # Create two (logged in) users
        self.user = UserFactory()
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
        response = self.query(query, user=self.user)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertIsNone(content["data"]["allUsers"])

        # Only super users (is_staffmember) should be able to retrieve all users
        response = self.query(query, user=self.super_user)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        # There are three users in the database (AnonymousUser, self.user and self.super_user)
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
        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        # Confirm content of query
        # TODO: Should look into better ways of doing this assertion
        for k, v in content["data"]["user"].items():
            value = getattr(self.user, to_snake_case(k))
            if type(value) == datetime:
                self.assertEqual(v, str(value.isoformat()))
                continue
            self.assertEqual(str(v), str(value))


class UsersMutationsTestCase(UsersBaseTestCase):
    """
    Testing all mutations for users
    """

    def test_auth_user(self):
        pass

    def test_update_user(self):
        pass

    def test_invalid_update_user(self):
        pass

    def test_get_id_token(self):
        pass
