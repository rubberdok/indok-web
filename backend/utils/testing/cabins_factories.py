from faker import Faker
from factory.django import DjangoModelFactory
import factory
from apps.cabins.models import Booking as BookingModel
import random
from django.utils import timezone


class BookingFactory(DjangoModelFactory):
    class Meta:
        model = BookingModel

    first_name = Faker(["no-NO"]).first_name()
    last_name = Faker(["no-NO"]).last_name()
    phone = "".join([random.choice(["4", "9"]), str(random.randint(1000000, 9999999))])
    receiver_email = Faker(["no-NO"]).ascii_company_email()
    timestamp = timezone.now()
    internal_participants = random.randint(1, 5)
    external_participants = random.randint(0, 5)

    @factory.post_generation
    def cabins(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for cabin in extracted:
                self.cabins.add(cabin)
