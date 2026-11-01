from datetime import datetime, time, timedelta

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

from apps.janhus.models import JanHusArea, JanHusBooking
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import UserFactory


class JanHusBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.user = UserFactory(is_indok=True)
        self.other_user = UserFactory(is_indok=True)

        self.start_dt = timezone.make_aware(
            datetime.combine((timezone.now() + timedelta(days=14)).date(), time(hour=10, minute=0))
        )
        self.end_dt = self.start_dt + timedelta(hours=2)

        self.entire_house_area, _ = JanHusArea.objects.get_or_create(name="Hele huset")
        self.first_floor_area, _ = JanHusArea.objects.get_or_create(
            name="1. etasje", defaults={"parent": self.entire_house_area}
        )
        self.second_floor_area, _ = JanHusArea.objects.get_or_create(
            name="2. etasje", defaults={"parent": self.entire_house_area}
        )

    def add_booking_permission(self, user):
        content_type = ContentType.objects.get_for_model(JanHusBooking)
        user.user_permissions.add(Permission.objects.get(codename="manage_booking", content_type=content_type))
