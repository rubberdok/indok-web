import factory
from datetime import timedelta

from apps.listings.models import Listing
from django.utils import timezone
from factory.django import DjangoModelFactory
from faker import Faker
from utils.testing.factories.organizations import OrganizationFactory

fake: Faker = Faker(["no-NO"])


class ListingFactory(DjangoModelFactory):
    class Meta:
        model = Listing

    description = fake.paragraph(nb_sentences=10)
    start_datetime = factory.LazyFunction(timezone.now)
    deadline = factory.LazyAttribute(
        lambda obj: obj.start_datetime + timedelta(days=14)
    )
    end_datetime = factory.LazyAttribute(
        lambda obj: obj.start_datetime + timedelta(days=30)
    )
    title = fake.catch_phrase()[:50]
    application_url = fake.url()
    read_more_url = fake.url()
    organization = factory.SubFactory(OrganizationFactory)
