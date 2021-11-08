import factory
from apps.listings.models import Listing
from factory.django import DjangoModelFactory
from faker import Faker
from utils.testing.factories.organizations import OrganizationFactory

fake: Faker = Faker(["no-NO"])


class ListingFactory(DjangoModelFactory):
    class Meta:
        model = Listing

    description = fake.paragraph(nb_sentences=10)
    start_datetime = fake.date_time().isoformat()
    deadline = fake.date_time().isoformat()
    title = fake.catch_phrase()[:50]
    application_url = fake.url()
    read_more_url = fake.url()
    organization = factory.SubFactory(OrganizationFactory)
