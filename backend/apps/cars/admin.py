from django.contrib import admin
from apps.cars.models import Car, Booking, BookingResponsible, BookingSemester

# Register your models here.

admin.site.register(Car)
admin.site.register(Booking)
admin.site.register(BookingResponsible)
admin.site.register(BookingSemester)