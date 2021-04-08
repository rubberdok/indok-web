from faker import Faker
from factory.django import DjangoModelFactory
import factory
from apps.cabins.models import Booking as BookingModel
import random
from django.utils import timezone


class BookingFactory(DjangoModelFactory):
    class Meta:
        model = BookingModel

    firstname = Faker(["no-NO"]).first_name()
    surname = Faker(["no-NO"]).last_name()
    phone = factory.LazyAttribute(lambda obj: random.randint(40039737, 49939737))
    receiver_email = Faker(["no-NO"]).ascii_company_email()
    price = factory.LazyAttribute(lambda obj: random.randint(1000, 5000))
    timestamp = timezone.now()

    @factory.post_generation
    def cabins(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for cabin in extracted:
                self.cabins.add(cabin)
