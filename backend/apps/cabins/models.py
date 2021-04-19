from django.db import models

from api.graphql.cabins.helpers import number_of_nights, is_internal_price, price


class Cabin(models.Model):
    name = models.CharField(max_length=100)
    max_guests = models.IntegerField(default=18)
    internal_price = models.IntegerField(default=1100)  # price per night
    external_price = models.IntegerField(default=2700)

    def __str__(self):
        return self.name


class Booking(models.Model):

    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    phone = models.CharField(max_length=8)
    receiver_email = models.CharField(max_length=100)
    check_in = models.DateField()
    check_out = models.DateField()
    cabins = models.ManyToManyField(Cabin)
    timestamp = models.DateTimeField()
    internal_participants = models.IntegerField()
    external_participants = models.IntegerField()
    is_tentative = models.BooleanField(default=False)

    @property
    def number_of_nights(self):
        return number_of_nights(self.check_out, self.check_in)

    @property
    def is_internal_price(self):
        return is_internal_price(self.internal_participants, self.external_participants)

    @property
    def price(self):
        return price(self.cabins, self.check_in, self.check_out, self.internal_participants, self.external_participants)

    def __str__(self):
        return f"Booking {self.id}, {self.firstname} {self.lastname}"
