from django.contrib import admin
from apps.booking.models import Product, Booking, BookingResponsible, BookingSemester

# Register your models here.

admin.site.register(Product)
admin.site.register(Booking)
admin.site.register(BookingResponsible)
admin.site.register(BookingSemester)
