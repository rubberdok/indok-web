from django.db import models

from apps.cabins.helpers import number_of_nights, is_internal_price, price


class Cabin(models.Model):
    name = models.CharField(max_length=100)
    max_guests = models.IntegerField(default=18)
    internal_price = models.IntegerField(default=1100)  # price per night
    external_price = models.IntegerField(default=2700)

    def __str__(self):
        return self.name


class Booking(models.Model):
    class Meta:
        permissions = [("send_email", "Can send email")]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=8)
    receiver_email = models.EmailField(max_length=100)
    check_in = models.DateField()
    check_out = models.DateField()
    cabins = models.ManyToManyField(Cabin)
    timestamp = models.DateTimeField(auto_now_add=True)
    internal_participants = models.IntegerField()
    external_participants = models.IntegerField()
    is_tentative = models.BooleanField(default=True)
    is_declined = models.BooleanField(default=False)

    @property
    def number_of_nights(self) -> int:
        return number_of_nights(self.check_out, self.check_in)

    @property
    def is_internal_price(self) -> bool:
        return is_internal_price(self.internal_participants, self.external_participants)

    @property
    def price(self) -> int:
        return price(
            self.cabins,
            self.check_in,
            self.check_out,
            self.internal_participants,
            self.external_participants,
        )

    def __str__(self):
        return f"Booking {self.id}, {self.first_name} {self.last_name}"


class BookingResponsible(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=8)
    email = models.EmailField(max_length=100)
    active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}, {'aktiv' if self.active else ''}"


class BookingSemester(models.Model):
    fall_start_date = models.DateField()
    fall_end_date = models.DateField()
    spring_start_date = models.DateField()
    spring_end_date = models.DateField()
    fall_semester_active = models.BooleanField()
    spring_semester_active = models.BooleanField()

    def __str__(self):
        return (
            f"Booking semester with fall semester from {self.fall_start_date} to {self.fall_end_date} and spring "
            f"semester from {self.spring_start_date} to {self.spring_end_date}"
        )
