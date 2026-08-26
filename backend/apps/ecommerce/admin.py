from django.contrib import admin

from .models import Order, Product, VippsAccessToken


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "user", "payment_status", "timestamp")
    list_filter = ("payment_status",)
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "product__name",
    )
    raw_id_fields = ("user", "product")


admin.site.register(VippsAccessToken)
