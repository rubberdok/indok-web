import random

import factory
from django.contrib.auth import get_user_model
from django.utils import timezone
from factory.django import DjangoModelFactory
from faker import Faker
from apps.organizations.models import Membership, Organization, Role

fake: Faker = Faker(["no-NO"])

class OrganizationFactory(DjangoModelFactory):
    class Meta:
        model = Organization

    name = fake.company()
    description = fake.catch_phrase()
    
class RoleFactory(DjangoModelFactory):
  class Meta:
    model = Role

  name = fake.bs()

class MembershipFactory(DjangoModelFactory):
  class Meta:
    model = Membership

  role = RoleFactory()
