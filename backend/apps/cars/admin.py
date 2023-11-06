from django.contrib import admin
from apps.cars.models import Car, CarBooking, CarBookingResponsible, CarBookingSemester

# Register your models here.

admin.site.register(Car)
admin.site.register(CarBooking)
admin.site.register(CarBookingResponsible)
admin.site.register(CarBookingSemester)
