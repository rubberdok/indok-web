from django.contrib import admin
from apps.cabins.models import Cabin, Booking

# Register your models here.

admin.site.register(Cabin)
admin.site.register(Booking)
