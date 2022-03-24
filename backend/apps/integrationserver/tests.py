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

    def test_cypress_allowed(self):
        with self.settings(URL_ROOTCONF="config.urls.test"):
            response = self.client.get("/test-session/")
            self.assertEqual(response.status_code, 200)

    def test_cypress_disallowed(self):
        with self.settings(URL_ROOTCONF="config.urls.production"):
            response = self.client.get("/test-session/")
            self.assertEqual(response.status_code, 404)
