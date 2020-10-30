from django.db import models

# Create your models here.
class Cabin(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Booking(models.Model):
    contact_num = models.IntegerField()
    contact_person = models.CharField(max_length=100)
    start_day = models.DateField()  # python datetime.date
    end_day = models.DateField()
    price = models.IntegerField()

    def __str__(self):
        return f"Booking {self.id}, {self.contact_person}"
