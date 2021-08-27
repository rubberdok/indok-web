from factory.django import DjangoModelFactory
from faker import Faker
from apps.organizations.models import Membership, Organization

fake: Faker = Faker(["no-NO"])


class OrganizationFactory(DjangoModelFactory):
    class Meta:
        model = Organization

    name = fake.company()
    description = fake.catch_phrase()


class MembershipFactory(DjangoModelFactory):
    class Meta:
        model = Membership
