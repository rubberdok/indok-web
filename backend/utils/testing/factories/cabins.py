from factory.django import DjangoModelFactory
from apps.cabins import models


class CabinFactory(DjangoModelFactory):
    class Meta:
        model = models.Cabin

    max_guests = 18
    internal_price = 1100
    external_price = 2700
