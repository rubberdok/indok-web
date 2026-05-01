from django.contrib.auth import get_user_model
from django.test import TestCase

from utils.testing.factories.users import UserFactory

from .models import NfcAccessEvent, NfcCard, NfcCardAssignment

User = get_user_model()


class NfcCardAssignmentModelTests(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_one_active_assignment_per_user(self):
        card1 = NfcCard.objects.create(uid_hex="04A1B2C3D4E5F6")
        card2 = NfcCard.objects.create(uid_hex="04A1B2C3D4E5F7")

        assignment = NfcCardAssignment.objects.create(card=card1, user=self.user)
        assignment.revoke(reason="Card replaced")

        replacement_assignment = NfcCardAssignment.objects.create(card=card2, user=self.user)

        self.assertIsNotNone(replacement_assignment.pk)

    def test_external_holder_assignment_without_user(self):
        card = NfcCard.objects.create(uid_hex="04A1B2C3D4E5F8")
        assignment = NfcCardAssignment.objects.create(card=card, external_holder_name="Guest Lecturer")

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
