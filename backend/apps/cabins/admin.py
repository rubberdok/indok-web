from django.contrib import admin
from apps.cabins.models import Cabin, Booking, BookingResponsible, BookingSemester

# Register your models here.

admin.site.register(Cabin)
admin.site.register(Booking)
admin.site.register(BookingResponsible)
admin.site.register(BookingSemester)
