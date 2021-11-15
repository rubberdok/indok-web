from django.contrib import admin
from apps.cabins.models import Cabin, Booking, BookingResponsible

# Register your models here.

admin.site.register(Cabin)
admin.site.register(Booking)
admin.site.register(BookingResponsible)
