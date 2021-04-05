from django.contrib import admin

from .models import Order, Product, VippsAccessToken

admin.site.register(Product)
admin.site.register(Order)
admin.site.register(VippsAccessToken)
