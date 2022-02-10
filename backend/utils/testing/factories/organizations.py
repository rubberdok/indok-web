from factory.django import DjangoModelFactory
from faker import Faker
from apps.organizations.models import Membership, Organization
import factory

fake: Faker = Faker(["no-NO"])


class OrganizationFactory(DjangoModelFactory):
    class Meta:
        model = Organization

    name = fake.company()
    description = fake.catch_phrase()


class MembershipFactory(DjangoModelFactory):
    class Meta:
        model = Membership

    @factory.post_generation
    def groups(self, create, extracted, **kwargs):
        """Makes it possible to pass in ResponsibleGroups as an array to the factory"""
        if not create:
            return
        if extracted:
            for group in extracted:
                self.groups.add(group)
