import random
import factory
from apps.ecommerce.models import Order, Product
from factory.django import DjangoModelFactory
from faker import Factory
import uuid

from utils.testing.factories.organizations import OrganizationFactory


fake = Factory.create()
cars = ["Luna", "Nova", "Atmos", "Eld", "Gnist", "Vilje", "Arctos", "Aquilo", "Borealis"]  # Atmos <3


class ProductFactory(DjangoModelFactory):
    class Meta:
        model = Product

    name = fake.first_name() + " " + random.choice(cars)
    price = str(fake.random_int(1, 4000000))
    description = fake.sentence(6)
    organization = factory.SubFactory(OrganizationFactory)
    total_quantity = fake.random_int(1, 10)
    max_buyable_quantity = fake.random_int(1, 5)


class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order

    order_id = uuid.uuid4().hex
    quantity = fake.random_int(1, 10)
    total_price = fake.random_int(100, 1000)
