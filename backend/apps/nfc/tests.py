from django.contrib.auth import get_user_model
from django.test import TestCase

from utils.testing.factories.users import UserFactory

from .models import (
    NfcAccessEvent,
    NfcCard,
    NfcCardAssignment,
    NfcSettings,
    get_or_create_nfc_settings,
)

User = get_user_model()


class NfcCardAssignmentModelTests(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_card_mifare_csn_input_is_converted_to_csn(self):
        card = NfcCard.objects.create(mifare_csn="9B87BA1C")

        self.assertEqual(card.mifare_csn, "0481986459")

    def test_one_active_assignment_per_user(self):
        card1 = NfcCard.objects.create(mifare_csn="1234567890")
        card2 = NfcCard.objects.create(mifare_csn="1234567891")

        assignment = NfcCardAssignment.objects.create(card=card1, user=self.user)
        assignment.revoke(reason="Card replaced")

        replacement_assignment = NfcCardAssignment.objects.create(
            card=card2, user=self.user
        )

        self.assertIsNotNone(replacement_assignment.pk)

    def test_external_holder_assignment_without_user(self):
        card = NfcCard.objects.create(mifare_csn="1234567892")
        assignment = NfcCardAssignment.objects.create(
            card=card, external_holder_name="Guest Lecturer"
        )

        self.assertIsNone(assignment.user)
        self.assertEqual(assignment.external_holder_name, "Guest Lecturer")


class NfcAccessEventModelTests(TestCase):
    def test_manual_key_door_open_event(self):
        event = NfcAccessEvent.objects.create(
            event_type=NfcAccessEvent.EventType.DOOR_OPENED,
            source=NfcAccessEvent.Source.MANUAL_KEY,
            door_identifier="janus-main-door",
            notes="Opened with physical key",
        )

        self.assertEqual(event.source, NfcAccessEvent.Source.MANUAL_KEY)


class NfcSettingsModelTests(TestCase):
    def test_get_or_create_returns_singleton(self):
        first = get_or_create_nfc_settings()
        second = get_or_create_nfc_settings()

        self.assertEqual(first.pk, NfcSettings.SINGLETON_PK)
        self.assertEqual(second.pk, NfcSettings.SINGLETON_PK)
        self.assertEqual(NfcSettings.objects.count(), 1)

    def test_default_values(self):
        settings_obj = get_or_create_nfc_settings()

        self.assertTrue(settings_obj.allow_user_mifare_csn_self_service)
