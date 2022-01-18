import random
import factory
from apps.ecommerce.models import Order, Product
from factory.django import DjangoModelFactory
from faker import Factory

from utils.testing.factories.organizations import OrganizationFactory


fake = Factory.create()
cars = ["Luna", "Nova", "Atmos", "Eld", "Gnist", "Vilje", "Arctos", "Aquilo", "Borealis"]  # Atmos <3


class ProductFactory(DjangoModelFactory):
    class Meta:
        model = Product

    name = fake.first_name() + " " + random.choice(cars)
    price = 1000.00
    description = fake.sentence(6)
    organization = factory.SubFactory(OrganizationFactory)
    total_quantity = 5
    max_buyable_quantity = 2


class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order

    quantity = 5
    total_price = 5000.00
