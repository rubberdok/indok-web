from django.db import models


# Create your models here.
class Cabin(models.Model):
    name = models.CharField(max_length=100)
    max_guests = models.IntegerField(default=20)
    internal_price = models.IntegerField(default=1100)  # price per night
    external_price = models.IntegerField(default=2700)

    def __str__(self):
        return self.name


class Booking(models.Model):

    firstname = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    phone = models.IntegerField()
    receiver_email = models.CharField(max_length=100)
    check_in = models.DateField()
    check_out = models.DateField()
    price = models.IntegerField()
    cabins = models.ManyToManyField(Cabin)
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"Booking {self.id}, {self.firstname} {self.surname}"
