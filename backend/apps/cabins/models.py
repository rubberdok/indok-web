from django.db import models

# Create your models here.
class Cabin(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Booking(models.Model):

    firstname = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    phone = models.IntegerField()
    receiverEmail = models.CharField(max_length=100)
    bookFrom = models.DateField()
    bookTo = models.DateField()
    price = models.IntegerField()

    def __str__(self):
        return f"Booking {self.id}, {self.firstname} {self.surname}"