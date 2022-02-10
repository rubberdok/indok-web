import random

import factory
from django.contrib.auth import get_user_model
from django.utils import timezone
from factory.django import DjangoModelFactory
from faker import Faker


def get_valid_graduation_year():
    now = timezone.now()
    return random.choice(range(now.year, now.year + 5) if now.month < 8 else range(now.year + 1, now.year + 6))


fake = Faker(["no-NO"])


class UserFactory(DjangoModelFactory):
    class Meta:
        model = get_user_model()

    username = factory.Sequence(lambda n: f"user{n}")
    first_name = fake.first_name()
    last_name = fake.last_name()
    email = fake.email()
    phone_number = fake.phone_number()
    feide_userid = fake.uuid4()
    feide_email = factory.lazy_attribute(lambda obj: f"{obj.username}@stud.ntnu.no")
    id_token = fake.uuid4()
    allergies = fake.bs()
    first_login = False
    graduation_year = factory.lazy_attribute(lambda _: get_valid_graduation_year())


class IndokUserFactory(UserFactory):
    is_indok = True


class StaffUserFactory(UserFactory):
    is_staff = True
