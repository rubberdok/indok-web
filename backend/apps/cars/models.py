from django.db import models

from apps.cars.helpers import number_of_nights, is_internal_price, price


class Car(models.Model):
    name = models.CharField(max_length=100)
    max_guests = models.PositiveIntegerField(default=18)
    # Prices for whole car per night
    internal_price = models.PositiveIntegerField(default=1100)
    internal_price_weekend = models.PositiveIntegerField(default=1100)
    external_price = models.PositiveIntegerField(default=3950)
    external_price_weekend = models.PositiveIntegerField(default=5400)

    def __str__(self):
        return self.name


class CarBooking(models.Model):
    class Meta:
        permissions = [("send_email", "Can send email"), ("manage_car_booking", "Can manage car_bookings, used for admins")]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    receiver_email = models.EmailField(max_length=100)
    check_in = models.DateField()
    check_out = models.DateField()
    cars = models.ManyToManyField(Car)
    timestamp = models.DateTimeField(auto_now_add=True)
    internal_participants = models.IntegerField()
    external_participants = models.IntegerField()
    is_tentative = models.BooleanField(default=True)
    is_declined = models.BooleanField(default=False)
    decline_reason = models.TextField(default="", blank=True)
    extra_info = models.TextField(default="", blank=True)

    @property
    def number_of_nights(self) -> int:
        return number_of_nights(self.check_out, self.check_in)

    @property
    def is_internal_price(self) -> bool:
        return is_internal_price(self.internal_participants, self.external_participants)

    @property
    def price(self) -> int:
        return price(
            self.cars,
            self.check_in,
            self.check_out,
            self.internal_participants,
            self.external_participants,
        )

    def __str__(self):
        return f"CarBooking {self.id}, {self.first_name} {self.last_name}"


class CarBookingResponsible(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField(max_length=100)
    active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}, {'aktiv' if self.active else ''}"


class CarBookingSemester(models.Model):
    fall_start_date = models.DateField()
    fall_end_date = models.DateField()
    spring_start_date = models.DateField()
    spring_end_date = models.DateField()
    fall_semester_active = models.BooleanField()
    spring_semester_active = models.BooleanField()

    def __str__(self):
        return (
            f"CarBooking semester with fall semester from {self.fall_start_date} to {self.fall_end_date} and spring "
            f"semester from {self.spring_start_date} to {self.spring_end_date}"
        )
