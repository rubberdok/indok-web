import warnings

from django.conf import settings
from django.test import SimpleTestCase

from utils.mail.streams import PostmarkEmail


class PostmarkEmailTests(SimpleTestCase):
    def test_warns_when_template_variables_missing_for_multiple_recipients(self):
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")

            PostmarkEmail(
                stream="order-confirmations",
                template_id=123,
                template_variables=None,
                to=["first@example.com", "second@example.com"],
            )

        self.assertTrue(any("template_variables is None" in str(w.message) for w in caught))

    def test_warns_when_template_variables_keys_are_not_emails(self):
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")

            PostmarkEmail(
                stream="order-confirmations",
                template_id=123,
                template_variables={"not-an-email": {"name": "Alice"}},
                to=["first@example.com"],
            )

        self.assertTrue(any("template_variables should have the following structure" in str(w.message) for w in caught))

    def test_sets_default_and_global_template_variables(self):
        email = PostmarkEmail(
            stream="order-confirmations",
            template_id=123,
            template_variables={"first@example.com": {"name": "Alice"}},
            global_template_variables={"custom_key": "custom_value"},
            to=["first@example.com"],
        )

        self.assertEqual(email.template_id, 123)
        self.assertEqual(email.merge_data, {"first@example.com": {"name": "Alice"}})
        self.assertEqual(email.merge_global_data["company_name"], "Rubberdøk")
        self.assertEqual(email.merge_global_data["parent_company"], "Foreningen for Studenter ved Indøk")
        self.assertEqual(email.merge_global_data["website_url"], settings.FRONTEND_BASE_URL)
        self.assertEqual(email.merge_global_data["contact_mail"], settings.CONTACT_EMAIL)
        self.assertEqual(email.merge_global_data["custom_key"], "custom_value")
