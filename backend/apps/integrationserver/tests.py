import json

from graphql_jwt.shortcuts import get_user_by_token
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import IndokUserFactory


class IntegrationServerTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.indok_user = IndokUserFactory(
            username="eva_student",
            first_name="Eva",
            last_name="Student Åsen",
            email="eva_student@feide.no",
            is_active=True,
            feide_userid="1d6dbc59-4d69-4b40-90c2-2cf9c0936720",
            feide_email="eva_student@feide.no",
            graduation_year=2025,
            is_indok=True,
            first_login=False,
        )
        self.auth_token = """
            query {
                authToken
            }
        """

    def test_cypress_allowed(self):
        with self.settings(CYPRESS=True):
            response = self.query(self.auth_token)
            self.assertResponseNoErrors(response)
            token = json.loads(response.content)["data"]["authToken"]
            self.assertEqual(get_user_by_token(token), self.indok_user)

    def test_cypress_disallowed(self):
        with self.settings(CYPRESS=False):
            response = self.query(self.auth_token)
            self.assert_permission_error(response)
