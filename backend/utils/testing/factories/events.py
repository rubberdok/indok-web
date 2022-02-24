from faker import Faker
from factory.django import DjangoModelFactory
import factory
from apps.events.models import (
    Event as EventModel,
    Category as CategoryModel,
    SignUp as SignUpModel,
)
from apps.organizations.models import Organization as OrganizationModel
from django.utils import timezone
from datetime import timedelta


class SimplifiedOrganizationFactory(DjangoModelFactory):
    class Meta:
        model = OrganizationModel

    name = factory.Sequence(lambda n: "organization%d" % n)
    description = "Veldig bra organisasjon!!"


class EventFactory(DjangoModelFactory):
    class Meta:
        model = EventModel

    title = factory.Sequence(lambda n: "event%d" % n)
    description = "Dette er et kult event!"
    organization = factory.SubFactory(SimplifiedOrganizationFactory)
    start_time = timezone.now() + timedelta(days=20)  # 20 days from now
    end_time = timezone.now() + timedelta(days=21)  # 21 days from now
    contact_email = Faker(["no-NO"]).ascii_company_email()
    # Below should be moved to AttendableFactory
    signup_open_date = timezone.now() + timedelta(days=1) 
    deadline = timezone.now() + timedelta(days=10)



class CategoryFactory(DjangoModelFactory):
    class Meta:
        model = CategoryModel

    name = factory.Sequence(lambda n: "category%d" % n)


class SignUpFactory(DjangoModelFactory):
    class Meta:
        model = SignUpModel

    timestamp = timezone.now()
    is_attending = True