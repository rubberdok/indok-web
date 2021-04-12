from django.db import models


class Cabin(models.Model):
    name = models.CharField(max_length=100)
    max_guests = models.IntegerField(default=18)
    internal_price = models.IntegerField(default=1100)  # price per night
    external_price = models.IntegerField(default=2700)

    def __str__(self):
        return self.name


class Booking(models.Model):

    firstname = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    phone = models.CharField(max_length=8)
    receiver_email = models.CharField(max_length=100)
    check_in = models.DateField()
    check_out = models.DateField()
    cabins = models.ManyToManyField(Cabin)
    timestamp = models.DateTimeField()
    internal_participants = models.IntegerField()
    external_participants = models.IntegerField()

    @property
    def number_of_nights(self):
        return (self.check_out - self.check_in).days

    @property
    def is_internal_price(self):
        return self.internal_participants >= self.external_participants

    @property
    def price(self):
        if self.is_internal_price:
            price_pr_night = self.cabins.aggregate(models.Sum("internal_price"))[
                "internal_price__sum"
            ]
        else:
            price_pr_night = self.cabins.aggregate(models.Sum("external_price"))[
                "external_price__sum"
            ]
        return price_pr_night * self.number_of_nights

    def __str__(self):
        return f"Booking {self.id}, {self.firstname} {self.surname}"
