import factory
from factory.django import DjangoModelFactory
from faker import Faker

from utils.testing.factories.organizations import OrganizationFactory

fake: Faker = Faker(["no-NO"])

from apps.listings.models import Listing


class ListingFactory(DjangoModelFactory):
    class Meta:
        model = Listing

    description = fake.paragraph(nb_sentences=10)
    start_datetime = fake.date_time().isoformat()
    deadline = fake.date_time().isoformat()
    title = fake.catch_phrase()
    application_url = fake.url()
    read_more_url = fake.url()
    organization = factory.SubFactory(OrganizationFactory)
