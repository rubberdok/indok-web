from django.test import TestCase
from django.test.utils import override_settings

from utils.testing.factories.users import IndokUserFactory


@override_settings(ROOT_URLCONF="config.urls.production")
class ProductionServerTestCase(TestCase):
    def test_cypress_disallowed(self):
        response = self.client.get("/test-session/")
        self.assertEqual(response.status_code, 404)


@override_settings(ROOT_URLCONF="config.urls.test")
class IntegrationServerTestCase(TestCase):
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
        response = self.client.get("/test-session/")
        self.assertEqual(response.status_code, 200)
