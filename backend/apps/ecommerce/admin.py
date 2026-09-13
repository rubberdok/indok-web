from django.contrib import admin
from django.contrib import messages

from .models import Order, Product, VippsAccessToken
from .vipps_utils import refund_order


@admin.action(description="Refund selected captured orders")
def refund_selected_orders(modeladmin, request, queryset):
    if not request.user.is_superuser:
        modeladmin.message_user(
            request,
            "Only superusers may refund orders.",
            messages.ERROR,
        )
        return

    for order in queryset:
        try:
            refund_order(order)
        except Exception:
            modeladmin.message_user(
                request,
                f"Could not refund order {order.id}.",
                messages.ERROR,
            )
        else:
            modeladmin.message_user(
                request,
                f"Refunded order {order.id}.",
                messages.SUCCESS,
            )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "user", "payment_status", "timestamp")
    list_filter = ("payment_status",)
    search_fields = (
        "id",
        "user__username",
        "user__first_name",
        "user__last_name",
        "product__name",
    )
    raw_id_fields = ("user", "product")
    actions = (refund_selected_orders,)

    def get_actions(self, request):
        actions = super().get_actions(request)
        if not request.user.is_superuser:
            actions.pop("refund_selected_orders", None)
        return actions


admin.site.register(VippsAccessToken)
