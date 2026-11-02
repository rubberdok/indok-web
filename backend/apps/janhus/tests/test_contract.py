import json
from datetime import datetime
from decimal import Decimal
from unittest.mock import patch
from zoneinfo import ZoneInfo

from django.contrib.auth.models import Permission
from django.template.loader import render_to_string

from apps.archive.models import ArchiveDocument
from config.sentry.scrubbing import scrub_event
from apps.janhus.contract import CONTRACT_BODY_TEMPLATE, contract_context
from apps.janhus.mail import CONTRACT_TEMPLATE, send_booking_confirmation
from apps.janhus.models import (
    JanHusBooking,
    JanHusBookingRequest,
    JanHusBookingSettings,
    JanHusBookingStatus,
)
from apps.janhus.tests.base import JanHusBaseTestCase
from utils.testing.factories.organizations import OrganizationFactory

OSLO = ZoneInfo("Europe/Oslo")
TEST_CODE = "TEST-KODE-77"
SAVE_SETTINGS = """
    mutation Save($settingsData: JanHusBookingSettingsInput!) {
      updateJanhusBookingSettings(settingsData: $settingsData) { ok }
    }
"""
PREVIEW_QUERY = """
    query Preview($contractData: JanHusContractPreviewInput!) {
      janhusContractPreview(contractData: $contractData)
    }
"""


def _archive_document(**overrides) -> ArchiveDocument:
    """The save signal asks Google Drive for the links, which a test cannot."""
    defaults = dict(title="JanHus Retningslinjer", type_doc="Foreningens lover", file_location="drive-file-id")
    defaults.update(overrides)
    with patch("apps.archive.models.GoogleDriveAPI") as drive:
        drive.return_value.get_url.return_value = defaults.pop("web_link", "https://docs.google.com/document/d/x")
        drive.return_value.get_thumbnail.return_value = None
        return ArchiveDocument.objects.create(**defaults)


class JanHusContractTestCase(JanHusBaseTestCase):
    def setUp(self):
        super().setUp()
        self.booking_settings = JanHusBookingSettings.objects.create(
            booking_contact_name="Kontakt Kontaktsen", booking_contact_phone="90000000", key_box_code=TEST_CODE
        )

    def _booking(self, **overrides) -> JanHusBooking:
        defaults = dict(
            starts_at=datetime(2031, 1, 15, 18, 0, tzinfo=OSLO),
            ends_at=datetime(2031, 1, 16, 1, 30, tzinfo=OSLO),
            area=self.entire_house_area,
            status=JanHusBookingStatus.CONFIRMED,
            booker_name="Kari Nordmann",
            booker_email="kari@example.com",
            booker_phone="41234567",
            responsible_name="Ola Nordmann",
            responsible_email="ola@example.com",
            responsible_phone="47654321",
            occasion="Bursdagsfeiring",
        )
        defaults.update(overrides)
        booking = JanHusBooking.objects.create(**defaults)
        booking.refresh_from_db()
        return booking

    def _render(self, booking, *, reveal_key_box_code=True) -> str:
        return render_to_string(
            CONTRACT_BODY_TEMPLATE, contract_context(booking, reveal_key_box_code=reveal_key_box_code)
        )

    def _save_settings(self, values):
        return self.query(SAVE_SETTINGS, variables={"settingsData": values})

    def _preview(self, **overrides):
        data = {
            "startsAt": "2031-01-15T18:00:00+01:00",
            "endsAt": "2031-01-16T01:30:00+01:00",
            "area": str(self.entire_house_area.id),
            "requesterName": "Kari Nordmann",
            "requesterEmail": "kari@example.com",
            "requesterPhone": "41234567",
            "occasion": "Bursdagsfeiring",
        }
        data.update(overrides)
        return self.query(PREVIEW_QUERY, variables={"contractData": data})

    def test_the_contract_is_filled_in_from_the_booking_and_the_settings(self):
        html = self._render(self._booking())

        for expected in [
            "Kontaktperson: Kontakt Kontaktsen, tlf. 90000000",
            "Kari Nordmann, tlf. 41234567",
            "e-post kari@example.com",
            "15.01.2031 kl. 18:00",
            "16.01.2031 kl. 01:30",
            "Bursdagsfeiring",
            "Hele huset",
        ]:
            self.assertIn(expected, " ".join(html.split()))
        self.assertNotIn("[", html)

    def test_the_times_are_in_norway_also_in_summer(self):
        html = self._render(
            self._booking(
                starts_at=datetime(2031, 6, 15, 18, 0, tzinfo=OSLO), ends_at=datetime(2031, 6, 15, 20, 0, tzinfo=OSLO)
            )
        )
        self.assertIn("15.06.2031 kl. 18:00", html)
        self.assertIn("15.06.2031 kl. 20:00", html)

    def test_the_tenant_falls_back_to_the_responsible_person_when_a_booking_has_no_booker_details(self):
        html = self._render(self._booking(booker_name="", booker_email="", booker_phone=""))

        self.assertIn("Ola Nordmann, tlf. 47654321", " ".join(html.split()))
        self.assertIn("ola@example.com", html)

    def test_the_code_is_only_in_the_contract_of_a_confirmed_booking(self):
        self.assertIn(TEST_CODE, self._render(self._booking()))

        booking = self._booking()
        self.assertNotIn(TEST_CODE, self._render(booking, reveal_key_box_code=False))
        self.assertNotIn(TEST_CODE, str(contract_context(booking, reveal_key_box_code=False)))

    def test_the_preview_never_gives_the_code_to_anyone(self):
        for label, user in [("logged out", None), ("logged in", self.user)]:
            with self.subTest(label):
                if user:
                    self.client.force_login(user)
                response = self._preview()
                self.assertResponseNoErrors(response)
                html = json.loads(response.content)["data"]["janhusContractPreview"]
                self.assertIn("Kari Nordmann", html)
                self.assertIn("når bookingen er godkjent", html)
                self.assertNotIn(TEST_CODE, html)

    def test_section_3_is_the_fixed_text_also_for_a_booking_with_a_price(self):
        self.entire_house_area.internal_price_per_hour = 100
        self.entire_house_area.save()

        for label, overrides in [
            ("personal", dict(deposit_amount=Decimal("500"))),
            ("organisation", dict(owner_organization=OrganizationFactory())),
        ]:
            with self.subTest(label):
                html = self._render(self._booking(**overrides))
                self.assertIn("<p>Leieprisen for perioden er kroner 0.</p>", html)
                self.assertNotIn("depositum", html)

    def test_booked_cleaning_stays_out_of_the_contract(self):
        booking = self._booking(cleaning_requested=True)

        self.assertNotIn("renhold", self._render(booking))
        self.assertNotIn("cleaning_fee", contract_context(booking, reveal_key_box_code=True))

    def test_the_archive_document_itself_is_not_on_the_api(self):
        response = self.query("query { janhusBookingSettings { guidelinesDocument { id } } }")

        self.assertResponseHasErrors(response)
        self.assertIn("Cannot query field", response.content.decode())

    def test_only_those_who_may_change_the_settings_can_read_the_code(self):
        query = "query { janhusBookingSettings { keyBoxCode } }"

        def code():
            response = self.query(query)
            self.assertResponseNoErrors(response)
            return json.loads(response.content)["data"]["janhusBookingSettings"]["keyBoxCode"]

        self.assertIsNone(code())

        self.client.force_login(self.user)
        self.assertIsNone(code())

        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings"))
        self.client.force_login(type(self.user).objects.get(pk=self.user.pk))
        self.assertEqual(TEST_CODE, code())

    def test_only_those_who_may_change_the_settings_can_change_the_code(self):
        values = {"keyBoxCode": "  NY-KODE  "}

        self.assertResponseHasErrors(self._save_settings(values))
        self.client.force_login(self.user)
        self.assertResponseHasErrors(self._save_settings(values))
        self.booking_settings.refresh_from_db()
        self.assertEqual(TEST_CODE, self.booking_settings.key_box_code)

        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings"))
        self.client.force_login(type(self.user).objects.get(pk=self.user.pk))
        self.assertResponseNoErrors(self._save_settings(values))
        self.booking_settings.refresh_from_db()
        self.assertEqual("NY-KODE", self.booking_settings.key_box_code)
        self.assertIn("NY-KODE", self._render(self._booking()))

        self.assertResponseNoErrors(self._save_settings({"minDurationMinutes": 60}))
        self.booking_settings.refresh_from_db()
        self.assertEqual("NY-KODE", self.booking_settings.key_box_code)

    def test_the_code_stays_out_of_sentry(self):
        event = {
            "request": {
                "url": "https://api.example.com/graphql/",
                "data": {"variables": {"settingsData": {"keyBoxCode": TEST_CODE}}},
            },
            "exception": {
                "values": [
                    {
                        "stacktrace": {
                            "frames": [
                                {"module": "apps.janhus.mail", "vars": {"html_string": TEST_CODE}},
                                {"module": "apps.janhus.contract", "vars": {"key_box_code": TEST_CODE}},
                            ]
                        }
                    }
                ]
            },
            "breadcrumbs": {
                "values": [
                    {
                        "category": "query",
                        "message": 'UPDATE "janhus_janhusbookingsettings" SET "key_box_code" = %s',
                        "data": {"db.params": [TEST_CODE]},
                    }
                ]
            },
        }

        self.assertNotIn(TEST_CODE, json.dumps(scrub_event(event, {})))

    def test_the_defaults_give_the_text_from_janus_eiendom(self):
        html = " ".join(self._render(self._booking()).replace("\u00a0", " ").replace("&nbsp;", " ").split())

        self.assertIn("leie av Janhus, Klostergata 26, inkludert inventar", html)
        self.assertIn("kroner 0.", html)
        self.assertIn("innen 24 timer etter", html)
        self.assertIn("3 000 kr", html)

    def test_the_contract_values_can_be_set(self):
        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings"))
        self.client.force_login(self.user)
        response = self._save_settings(
            {
                "bookingContactName": "Ny Kontakt",
                "bookingContactPhone": "91111111",
                "contractAddress": "Nyveien 1",
                "contractRentAmount": 12500,
                "contractMaxFee": 5000,
                "contractCleaningDeadlineHours": 48,
            }
        )
        self.assertResponseNoErrors(response)

        html = " ".join(self._render(self._booking()).replace("\u00a0", " ").replace("&nbsp;", " ").split())
        for expected in [
            "Ny Kontakt, tlf. 91111111",
            "leie av Janhus, Nyveien 1,",
            "kroner 12 500.",
            "innen 48 timer etter",
            "5 000 kr",
        ]:
            self.assertIn(expected, html)

    def test_the_contract_values_are_checked_and_guarded(self):
        self.assertResponseHasErrors(self._save_settings({"contractMaxFee": 1}))
        self.client.force_login(self.user)
        self.assertResponseHasErrors(self._save_settings({"contractMaxFee": 1}))

        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings"))
        self.client.force_login(type(self.user).objects.get(pk=self.user.pk))
        for bad in [{"contractAddress": ""}, {"contractMaxFee": -1}, {"contractRentAmount": -1}]:
            with self.subTest(bad):
                self.assertResponseHasErrors(self._save_settings(bad))
        self.booking_settings.refresh_from_db()
        self.assertEqual("Klostergata 26", self.booking_settings.contract_address)
        self.assertEqual(3000, self.booking_settings.contract_max_fee)

    def test_what_the_booker_writes_is_escaped_in_the_preview(self):
        response = self._preview(occasion="<script>alert(1)</script>", requesterName="<img src=x onerror=alert(1)>")

        html = json.loads(response.content)["data"]["janhusContractPreview"]
        self.assertNotIn("<script", html)
        self.assertNotIn("<img", html)
        self.assertIn("&lt;script&gt;", html)

    def test_the_preview_refuses_an_unknown_area(self):
        for area in ["999999", "abc", "²"]:
            with self.subTest(area):
                response = self._preview(area=area)
                self.assertResponseHasErrors(response)
                self.assertIn("Area not found", response.content.decode())

    def test_a_contract_that_cannot_be_built_does_not_stop_the_confirmation_mail(self):
        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email, patch(
            "apps.janhus.mail.html_to_pdf", side_effect=RuntimeError("weasyprint broke")
        ):
            with self.assertLogs("apps.janhus.mail", level="ERROR"):
                send_booking_confirmation(self._booking())

        mocked_email.return_value.send.assert_called_once()
        mocked_email.return_value.attach.assert_not_called()
        self.assertNotIn("vedlagt", mocked_email.call_args.kwargs["body"])

    def test_the_confirmation_mail_says_the_contract_is_attached(self):
        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
            send_booking_confirmation(self._booking())

        self.assertIn("Kontrakten ligger vedlagt", mocked_email.call_args.kwargs["body"])

    def test_empty_contact_details_are_saved_as_empty(self):
        self.user.user_permissions.add(Permission.objects.get(codename="manage_settings"))
        self.client.force_login(self.user)

        self.assertResponseNoErrors(self._save_settings({"bookingContactName": None, "bookingContactPhone": None}))

        self.booking_settings.refresh_from_db()
        self.assertEqual("", self.booking_settings.booking_contact_name)
        self.assertEqual("", self.booking_settings.booking_contact_phone)

    def test_the_pdf_template_renders_with_the_code(self):
        html = render_to_string(CONTRACT_TEMPLATE, contract_context(self._booking(), reveal_key_box_code=True))

        self.assertIn("Leiekontrakt", html)
        self.assertIn(TEST_CODE, html)

    def test_the_confirmation_mail_attaches_the_contract_without_putting_the_code_in_the_mail_text(self):
        booking = self._booking()

        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email, patch(
            "apps.janhus.mail.html_to_pdf", return_value=b"%PDF-"
        ) as html_to_pdf:
            send_booking_confirmation(booking)

        template, context = html_to_pdf.call_args.args
        self.assertEqual(CONTRACT_TEMPLATE, template)
        self.assertEqual(TEST_CODE, context["key_box_code"])
        self.assertNotIn(TEST_CODE, mocked_email.call_args.kwargs["body"])
        self.assertNotIn(TEST_CODE, mocked_email.return_value.attach_alternative.call_args.args[0])

    def test_the_guidelines_link_follows_the_chosen_archive_document(self):
        query = "query { janhusBookingSettings { guidelinesUrl guidelinesTitle } }"

        def settings_data():
            return json.loads(self.query(query).content)["data"]["janhusBookingSettings"]

        self.assertIsNone(settings_data()["guidelinesUrl"])

        document = _archive_document()
        self.booking_settings.guidelines_document = document
        self.booking_settings.save()
        self.assertEqual(
            {"guidelinesUrl": "https://docs.google.com/document/d/x", "guidelinesTitle": "JanHus Retningslinjer"},
            settings_data(),
        )

        newer = _archive_document(title="Retningslinjer 2027", web_link="https://docs.google.com/document/d/y")
        self.booking_settings.guidelines_document = newer
        self.booking_settings.save()
        self.assertEqual("https://docs.google.com/document/d/y", settings_data()["guidelinesUrl"])

        newer.delete()
        self.assertIsNone(settings_data()["guidelinesUrl"])

    def test_the_guidelines_link_is_only_ever_an_https_link(self):
        document = _archive_document()
        for web_link in [None, "", "javascript:alert(1)", "http://example.com"]:
            with self.subTest(web_link):
                document.web_link = web_link
                document.save()
                self.booking_settings.guidelines_document = document
                self.assertEqual(
                    "https://drive.google.com/file/d/drive-file-id/view", self.booking_settings.guidelines_url
                )

    def test_the_confirmation_mail_links_the_guidelines(self):
        self.booking_settings.guidelines_document = _archive_document()
        self.booking_settings.save()

        with patch("apps.janhus.mail.TransactionalEmail") as mocked_email:
            send_booking_confirmation(self._booking())

        self.assertIn("https://docs.google.com/document/d/x", mocked_email.call_args.kwargs["body"])

    def test_a_request_needs_an_occasion_and_keeps_it_as_a_booking(self):
        self.client.force_login(self.user)
        mutation = """
            mutation Create($requestData: JanHusBookingRequestInput!) {
              createJanhusBookingRequest(requestData: $requestData) { ok }
            }
        """
        data = {
            "startsAt": self.start_dt.isoformat(),
            "endsAt": self.end_dt.isoformat(),
            "area": str(self.entire_house_area.id),
            "requesterName": "Kari",
            "responsibleName": "Kari",
            "responsibleEmail": "kari@example.com",
            "responsiblePhone": "41234567",
        }

        for occasion in [None, "", "   "]:
            with self.subTest(occasion):
                response = self.query(mutation, variables={"requestData": {**data, "occasion": occasion}})
                self.assertResponseHasErrors(response)
                self.assertIn("anledningen", response.content.decode())
        self.assertFalse(JanHusBookingRequest.objects.exists())

        response = self.query(mutation, variables={"requestData": {**data, "occasion": " Bursdag "}})
        self.assertResponseNoErrors(response)
        booking_request = JanHusBookingRequest.objects.get()
        self.assertEqual("Bursdag", booking_request.occasion)

        admin = self.other_user
        self.add_booking_permission(admin)
        self.client.force_login(admin)
        review = """
            mutation Review($reviewData: ReviewJanHusBookingRequestInput!) {
              reviewJanhusBookingRequest(reviewData: $reviewData) { ok }
            }
        """
        response = self.query(
            review,
            variables={"reviewData": {"id": booking_request.id, "status": "APPROVED", "convertToBooking": True}},
        )
        self.assertResponseNoErrors(response)
        self.assertEqual("Bursdag", JanHusBooking.objects.get().occasion)

    def test_the_occasion_is_private_and_only_an_admin_may_change_it(self):
        booking = self._booking(owner_user=self.user, booker_user=self.user)
        read = "query { janhusBookings { id occasion } }"

        self.client.force_login(self.other_user)
        response = self.query(read)
        self.assertResponseHasErrors(response)
        self.assertIn("ikke tilgang", response.content.decode())
        self.assertNotIn("Bursdagsfeiring", response.content.decode())

        self.client.force_login(self.user)
        response = self.query(read)
        self.assertResponseNoErrors(response)
        self.assertIn("Bursdagsfeiring", response.content.decode())

        update = """
            mutation Update($bookingData: UpdateJanHusBookingInput!) {
              updateJanhusBooking(bookingData: $bookingData) { ok }
            }
        """
        self.client.force_login(self.user)
        response = self.query(update, variables={"bookingData": {"id": booking.id, "occasion": "Noe annet"}})
        self.assertResponseHasErrors(response)
        booking.refresh_from_db()
        self.assertEqual("Bursdagsfeiring", booking.occasion)

        self.add_booking_permission(self.other_user)
        self.client.force_login(self.other_user)
        response = self.query(update, variables={"bookingData": {"id": booking.id, "occasion": "Noe annet"}})
        self.assertResponseNoErrors(response)
        booking.refresh_from_db()
        self.assertEqual("Noe annet", booking.occasion)
