import hashlib
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.utils import timezone

from apps.arx.models import ArxAreaMapping, get_arx_settings
from apps.janhus.models import JanHusArea, JanHusBooking, JanHusBookingStatus
from apps.nfc.models import NfcCard, NfcCardAssignment

User = get_user_model()


@override_settings(ARX_STATE_HMAC_KEY="test-key", ARX_RUNNER_TOKEN_SHA256S=[hashlib.sha256(b"tok").hexdigest()])
class ArxTestCase(TestCase):
    def setUp(self):
        cfg = get_arx_settings()
        cfg.sync_enabled = True
        cfg.save()
        self.area, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        ArxAreaMapping.objects.update_or_create(
            area=self.area,
            defaults={"grants_access": True, "arx_category_id": "cat-hus"},
        )
        self.user = User.objects.create(username="ola", first_name="Ola", last_name="Nord", feide_userid="f-1")
        self.card = NfcCard.objects.create(mifare_csn="0123456789")
        self.assignment = NfcCardAssignment.objects.create(card=self.card, user=self.user, pin_code="4321")
        now = timezone.now()
        self.booking = JanHusBooking.objects.create(
            starts_at=now + timedelta(days=1),
            ends_at=now + timedelta(days=2),
            area=self.area,
            status=JanHusBookingStatus.CONFIRMED,
            owner_user=self.user,
            responsible_name="Ola",
            responsible_email="o@example.org",
            responsible_phone="40000000",
        )
